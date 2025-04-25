import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { OrderModel } from '@/models/schemas/order.schema';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const order = await OrderModel.findById(params.id)
      .populate('customer')
      .populate('items.product');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
            id: item.product._id?.toString() || '',
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
      }
    });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await connectToDB();

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).populate('customer').populate('items.product');

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedOrder._id.toString(),
        customer: {
          id: updatedOrder.customer._id.toString(),
          name: updatedOrder.customer.name,
          email: updatedOrder.customer.email,
          phone: updatedOrder.customer.phone,
          company: updatedOrder.customer.company
        },
        items: updatedOrder.items.map((item: any) => ({
          product: {
            id: item.product._id?.toString() || '',
            name: item.product.name || 'Unknown Product'
          },
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          material: item.material,
          price: item.price,
          printType: item.printType
        })),
        status: updatedOrder.status,
        dueDate: updatedOrder.dueDate,
        payment: updatedOrder.payment,
        design: updatedOrder.design,
        shipping: updatedOrder.shipping,
        createdAt: updatedOrder.createdAt,
        updatedAt: updatedOrder.updatedAt
      }
    });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const deletedOrder = await OrderModel.findByIdAndDelete(params.id);

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: params.id }
    });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}