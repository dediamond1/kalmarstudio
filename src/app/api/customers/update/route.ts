import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { CustomerModel } from '@/models/schemas/customer.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id || !body?.data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const { id, data } = body;
    await connectToDB();
    
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}
