import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { OrderModel } from '@/models/schemas/order.schema';

export async function GET() {
  try {
    await connectToDB();
    const orders = await OrderModel.find()
      .populate({
        path: 'customer',
        select: 'name email phone company'
      })
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
        design: order.design,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }))
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
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
    
    // Populate customer information
    await order.populate('customer');
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
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
          design: order.design,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create order' 
      },
      { status: 500 }
    );
  }
}