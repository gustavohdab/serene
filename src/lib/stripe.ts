import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
  typescript: true,
})
