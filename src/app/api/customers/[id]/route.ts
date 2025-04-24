import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const conn = await connectToDB();
    
    if (!conn.connection.db) {
      return NextResponse.json(
        { error: 'Database connection not established' },
        { status: 500 }
      );
    }

    const customer = await conn.connection.db
      .collection('customers')
      .findOne({ _id: new ObjectId(id) });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}
