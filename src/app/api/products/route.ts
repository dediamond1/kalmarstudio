import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { ProductModel } from '@/models/schemas/product.schema';
import { CategoryModel } from '@/models/schemas/category.schema';

export async function GET(request: Request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sizes = searchParams.getAll('sizes');
    const colors = searchParams.getAll('colors');
    const materials = searchParams.getAll('materials');
    const printTypes = searchParams.getAll('printTypes');
    const onSale = searchParams.get('onSale');

    let query: any = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    // Array filters
    if (sizes.length) query.availableSizes = { $in: sizes };
    if (colors.length) query.colors = { $in: colors };
    if (materials.length) query.materials = { $in: materials };
    if (printTypes.length) query.printTypes = { $in: printTypes };

    // Sale filter
    if (onSale === 'true') {
      query.discountPrice = { $exists: true, $gt: 0 };
    }

    // Sorting
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOption = { basePrice: 1 };
          break;
        case 'price-desc':
          sortOption = { basePrice: -1 };
          break;
        case 'name-asc':
          sortOption = { name: 1 };
          break;
        case 'name-desc':
          sortOption = { name: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
      }
    }

    const products = await ProductModel.find(query)
      .populate('category', 'name slug')
      .sort(sortOption);
      
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
