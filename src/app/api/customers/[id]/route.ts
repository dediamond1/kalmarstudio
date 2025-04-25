import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { CustomerModel } from '@/models/schemas/customer.schema';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const customer = await CustomerModel.findById(params.id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      taxId: customer.taxId,
      notes: customer.notes,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    });
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
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

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updatedCustomer._id,
      name: updatedCustomer.name,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      company: updatedCustomer.company,
      address: updatedCustomer.address,
      taxId: updatedCustomer.taxId,
      notes: updatedCustomer.notes,
      createdAt: updatedCustomer.createdAt,
      updatedAt: updatedCustomer.updatedAt
    });
  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
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
    const deletedCustomer = await CustomerModel.findByIdAndDelete(params.id);

    if (!deletedCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: params.id }
    });
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}