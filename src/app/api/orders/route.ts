import { NextResponse } from 'next/server'
import { OrderModel } from '@/models/schemas/order.schema'
import { connectToDB } from '@/lib/mongoose'

export async function POST(request: Request) {
  try {
    await connectToDB()
    const body = await request.json()

    // Basic validation - just check for items array
 

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum: number, item: any) => sum + (item.price * item.quantity),
      0
    )
    const total = subtotal + (body.tax || 0) + (body.shippingCost || 0)

    const order = new OrderModel({
      customerId: body.customerId,
      items: body.items,
      subtotal,
      tax: body.tax || 0,
      shippingCost: body.shippingCost || 0,
      total,
      status: 'pending',
      paymentMethod: body.paymentMethod,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress || body.shippingAddress
    })

    await order.save()

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', errors: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectToDB()
    const orders = await OrderModel.find().sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
