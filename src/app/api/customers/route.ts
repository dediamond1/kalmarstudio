import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { ICustomer as Customer } from '@/models/customer.model';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const conn = await connectToDB();
    if (!conn.connection.db) {
      return NextResponse.json(
        { error: 'Database connection not established' },
        { status: 500 }
      );
    }
    const customers = await conn.connection.db
      .collection('customers')
      .find()
      .toArray();
    console.log(customers)
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
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
