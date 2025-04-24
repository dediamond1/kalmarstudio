import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { CustomerModel } from '@/models/schemas/customer.schema';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    await connectToDB();
    
    const result = await CustomerModel.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
