import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { CustomerModel } from '@/models/schemas/customer.schema';

export async function GET() {
  try {
    await connectToDB();
    const customers = await CustomerModel.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      customers.map(customer => ({
        id: customer._id as any,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        address: customer.address,
        taxId: customer.taxId,
        notes: customer.notes,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      }))
    );
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDB();
    
    const customer = new CustomerModel(body);
    await customer.save();
    
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
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create customer:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A customer with this email already exists.' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create customer' 
      },
      { status: 500 }
    );
  }
}