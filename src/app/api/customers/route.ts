import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { CustomerModel } from '@/models/schemas/customer.schema';

export async function GET(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      const customer = await CustomerModel.findOne({ email });
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
    }

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

    // Minimal guest customer creation
    const customerData = {
      email: body.email,
      name: body.name || 'Guest Customer',
      phone: body.phone || '',
      company: body.company || '',
      address: body.address || {
        street: '',
        city: '',
        country: ''
      },
      customerType: body.email ? 'business' : 'guest',
      status: 'active'
    };

    const customer = new CustomerModel(customerData);
    await customer.save();
    
    return NextResponse.json({
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      customerType: customer.customerType,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create customer:', error);
    
    if (error.code === 11000) {
      // If customer exists, return their info
      const existingCustomer = await CustomerModel.findOne({ email: body.email });
      if (existingCustomer) {
        return NextResponse.json({
          id: existingCustomer._id,
          name: existingCustomer.name,
          email: existingCustomer.email,
          phone: existingCustomer.phone,
          company: existingCustomer.company,
          address: existingCustomer.address,
          customerType: existingCustomer.customerType,
          status: existingCustomer.status,
          createdAt: existingCustomer.createdAt,
          updatedAt: existingCustomer.updatedAt
        });
      }
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
