import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { CategoryModel } from '@/models/schemas/category.schema';

// Helper function to slugify category names
function createSlug(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/[^\w\-]+/g, '')      // Remove all non-word chars
    .replace(/\-\-+/g, '-')        // Replace multiple - with single -
    .trim();                        // Trim - from start and end
}

// GET all categories (with optional parent parameter to get subcategories)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    
    await connectToDB();
    
    let query: any = {};
    if (parentId === 'null') {
      // Get top-level categories (those with no parent)
      query.parentId = null;
    } else if (parentId) {
      // Get subcategories of a specific parent
      query.parentId = parentId;
    }
    
    const categories = await CategoryModel.find(query)
      .populate('subcategories')
      .sort({ sortOrder: 1, name: 1 });
      
    return NextResponse.json({ 
      success: true, 
      data: categories.map(category => ({
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId ? category.parentId.toString() : null,
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        imageUrl: category.imageUrl,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        subcategories: category.subcategories ? category.subcategories.map((subcat: any) => ({
          id: subcat._id.toString(),
          name: subcat.name,
          slug: subcat.slug,
          parentId: subcat.parentId.toString(),
          isActive: subcat.isActive,
          sortOrder: subcat.sortOrder
        })) : []
      }))
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDB();
    
    // Generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = createSlug(body.name);
    }
    
    const category = new CategoryModel(body);
    await category.save();
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          description: category.description,
          parentId: category.parentId ? category.parentId.toString() : null,
          isActive: category.isActive,
          sortOrder: category.sortOrder,
          imageUrl: category.imageUrl,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create category:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { 
          success: false, 
          error: `A category with this ${field} already exists.` 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create category' 
      },
      { status: 500 }
    );
  }
}