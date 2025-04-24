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
        customer: order.customer,
        items: order.items,
        status: order.status,
        dueDate: order.dueDate,
        payment: order.payment,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
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

    return NextResponse.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
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
    await OrderModel.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
