import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { ProductModel } from '@/models/schemas/product.schema';

export async function GET() {
  try {
    await connectToDB();
    const products = await ProductModel.find()
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ 
      success: true, 
      data: products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        printTypes: product.printTypes,
        availableSizes: product.availableSizes,
        colors: product.colors,
        materials: product.materials,
        minOrderQuantity: product.minOrderQuantity,
        imageUrls: product.imageUrls,
        category: product.category,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDB();
    
    const product = new ProductModel(body);
    await product.save();
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          printTypes: product.printTypes,
          availableSizes: product.availableSizes,
          colors: product.colors,
          materials: product.materials,
          minOrderQuantity: product.minOrderQuantity,
          imageUrls: product.imageUrls,
          category: product.category,
          isActive: product.isActive,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create product' 
      },
      { status: 500 }
    );
  }
}