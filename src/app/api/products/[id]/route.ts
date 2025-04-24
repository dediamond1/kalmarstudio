import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { ProductModel } from '@/models/schemas/product.schema';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const product = await ProductModel.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
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

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedProduct._id.toString(),
        name: updatedProduct.name,
        description: updatedProduct.description,
        basePrice: updatedProduct.basePrice,
        printTypes: updatedProduct.printTypes,
        availableSizes: updatedProduct.availableSizes,
        colors: updatedProduct.colors,
        materials: updatedProduct.materials,
        minOrderQuantity: updatedProduct.minOrderQuantity,
        imageUrls: updatedProduct.imageUrls,
        category: updatedProduct.category,
        isActive: updatedProduct.isActive,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt
      }
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
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
    const deletedProduct = await ProductModel.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: params.id }
    });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}