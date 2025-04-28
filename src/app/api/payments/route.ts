import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil'
})

export async function POST(req: Request) {
  try {
    const { amount, currency, metadata, address, savePaymentMethod } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'usd',
      metadata: {
        ...metadata,
        ...address,
        savePaymentMethod: savePaymentMethod ? 'true' : 'false'
      },
      automatic_payment_methods: {
        enabled: true
      },
      setup_future_usage: savePaymentMethod ? 'off_session' : undefined
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
