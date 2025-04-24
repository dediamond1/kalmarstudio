import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { OrderModel } from '@/models/schemas/order.schema';
import { Order } from '@/types/order';

export async function GET() {
  try {
    await connectToDB();
    const orders = await OrderModel.find()
      .populate({
        path: 'customer',
        select: 'name email phone company'
      })
      .populate('items.product')
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ 
      success: true, 
      data: orders.map(order => ({
        id: order._id.toString(),
        customer: {
          id: order.customer._id.toString(),
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          company: order.customer.company
        },
        items: order.items,
        status: order.status,
        dueDate: order.dueDate,
        payment: order.payment,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDB();
    
    const order = new OrderModel(body);
    await order.save();
    
    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
