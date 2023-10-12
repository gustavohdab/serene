import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { prisma } from '@/db/prisma'
import { stripe } from '@/lib/stripe'

class WebhookError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WebhookError'
  }
}

function isCheckoutSessionCompleted(
  event: Stripe.Event,
): event is Stripe.Event & { data: { object: Stripe.Checkout.Session } } {
  return event.type === 'checkout.session.completed'
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature')
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new WebhookError('Missing signature or webhook secret')
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new NextResponse(`Webhook Error: ${err.message}`, {
        status: 400,
      })
    } else {
      return new NextResponse(`Webhook Error: ${err}`, {
        status: 400,
      })
    }
  }

  if (isCheckoutSessionCompleted(event)) {
    const session = event.data.object
    const userId = session?.metadata?.userId
    const courseId = session?.metadata?.courseId

    if (!userId || !courseId) {
      return new NextResponse('Missing metadata', { status: 400 })
    }

    await prisma.purchase.create({
      data: {
        userId,
        courseId,
      },
    })
  }

  return new NextResponse(null, { status: 200 })
}
