import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { CreateCustomerDto } from '@/models/customer.model';
import { CustomerModel } from '@/models/schemas/customer.schema';

export async function POST(request: Request) {
  try {
    const data: CreateCustomerDto = await request.json();
    await connectToDB();
    
    const customer = await CustomerModel.create(data);
    return NextResponse.json(customer);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
