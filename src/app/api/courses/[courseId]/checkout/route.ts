/* eslint-disable camelcase */
import { currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { prisma } from '@/db/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      courseId: string
    }
  },
) {
  try {
    const user = await currentUser()

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    })

    const alreadyEnrolled = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    })

    if (alreadyEnrolled) {
      return new NextResponse('Already enrolled', { status: 409 })
    }

    if (!course) {
      return new NextResponse('Not found', { status: 404 })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: course.description || undefined,
          },
          unit_amount: Math.round(course.price || 0 * 100),
        },
      },
    ]

    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    })

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress,
      })

      stripeCustomer = await prisma.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      })
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer?.stripeCustomerId,
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.log('COURSE_ID_CHECKOUT', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
