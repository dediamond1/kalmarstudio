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
      .populate({
        path: 'items.product',
        select: 'name basePrice category'
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
        items: order.items.map((item: any) => ({
          product: {
            id: item.product._id?.toString(),
            name: item.product.name || 'Unknown Product'
          },
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          material: item.material,
          price: item.price,
          printType: item.printType
        })),
        status: order.status,
        dueDate: order.dueDate,
        payment: order.payment,
        design: order.design,
        shipping: order.shipping,
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
    
    const order = new OrderModel({
      customer: body.customer,
      status: body.status,
      dueDate: body.dueDate,
      items: body.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        material: item.material,
        printType: item.printType,
        price: item.price
      })),
      shipping: body.shipping || {
        method: 'Standard',
        cost: 0
      },
      design: {
        description: body.design.description,
        placement: body.design.placement,
        colors: body.design.colors || [],
        mockupUrl: body.design.mockupUrl,
      },
      payment: {
        status: body.payment.status,
        method: body.payment.method,
        amount: body.payment.amount,
        tax: body.payment.tax,
        discount: body.payment.discount || 0,
        shipping: body.payment.shipping || 0,
        total: body.payment.total,
      },
      notes: body.notes,
    });
    
    await order.save();
    
    // Populate customer information
    await order.populate('customer');
    await order.populate('items.product');
    
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
          items: order.items.map((item: any) => ({
            product: {
              id: item.product._id?.toString() || item.product,
              name: item.product.name || 'Unknown Product'
            },
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            material: item.material,
            price: item.price,
            printType: item.printType
          })),
          shipping: order.shipping,
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