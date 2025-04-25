import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { ProductModel } from '@/models/schemas/product.schema';

export async function GET() {
  try {
    await connectToDB();
    const products = await ProductModel.find({ isActive: true })
      .populate('category', 'name')
      .sort({ name: 1 });
      
    return NextResponse.json({ 
      success: true, 
      data: products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        basePrice: product.basePrice,
        category: {
          id: product.category._id,
          name: product.category.name
        },
        availableSizes: product.availableSizes,
        colors: product.colors,
        materials: product.materials
      }))
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}