import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { ProductModel } from '@/models/schemas/product.schema';
import { CategoryModel } from '@/models/schemas/category.schema';

export async function GET() {
  try {
    await connectToDB();
    const products = await ProductModel.find()
      .populate('category', 'name slug') // Populate category information
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ 
      success: true, 
      data: products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        printTypes: product.printTypes || [],
        availableSizes: product.availableSizes || [],
        colors: product.colors || [],
        materials: product.materials || [],
        minOrderQuantity: product.minOrderQuantity || 1,
        imageUrls: product.imageUrls || [],
        category: {
          id: product.category?._id || '',
          name: product.category?.name || 'Uncategorized',
          slug: product.category?.slug || ''
        },
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const body = await request.json();
      await connectToDB();
      
      console.log("API received product data:", body);
      
      // Validate that the category field exists
      if (!body.category) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Category is required'
          },
          { status: 400 }
        );
      }
      
      // Validate that the category exists in database
      const categoryExists = await CategoryModel.exists({ _id: body.category });
      if (!categoryExists) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'The selected category does not exist'
          },
          { status: 400 }
        );
      }
      
      const product = new ProductModel(body);
      await product.save();
      
      // Populate the category information for the response
      await product.populate('category', 'name slug');
      
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
            category: {
              id: product.category?._id || "uncategorized",
              name: product.category.name || "uncategorized",
              slug: product.category.slug
            },
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          }
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Failed to create product:', error);
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          { 
            success: false, 
            error: 'Validation error', 
            details: validationErrors
          },
          { status: 400 }
        );
      }
      
      // Handle MongoDB errors
      if (error.code === 11000) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Duplicate product name or other unique field'
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to create product'
        },
        { status: 500 }
      );
    }
  }