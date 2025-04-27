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

// GET a specific category by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const category = await CategoryModel.findById(params?.id)
      .populate('subcategories');

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
        updatedAt: category.updatedAt,
        subcategories: category.subcategories ? category.subcategories.map((subcat: any) => ({
          id: subcat._id.toString(),
          name: subcat.name,
          slug: subcat.slug,
          parentId: subcat.parentId.toString(),
          isActive: subcat.isActive,
          sortOrder: subcat.sortOrder
        })) : []
      }
    });
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await connectToDB();

    // Generate slug if name is being updated and slug isn't provided
    if (body.name && !body.slug) {
      body.slug = createSlug(body.name);
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).populate('subcategories');

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedCategory._id.toString(),
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        description: updatedCategory.description,
        parentId: updatedCategory.parentId ? updatedCategory.parentId.toString() : null,
        isActive: updatedCategory.isActive,
        sortOrder: updatedCategory.sortOrder,
        imageUrl: updatedCategory.imageUrl,
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt,
        subcategories: updatedCategory.subcategories ? updatedCategory.subcategories.map((subcat: any) => ({
          id: subcat._id.toString(),
          name: subcat.name,
          slug: subcat.slug,
          parentId: subcat.parentId.toString(),
          isActive: subcat.isActive,
          sortOrder: subcat.sortOrder
        })) : []
      }
    });
  } catch (error: any) {
    console.error('Failed to update category:', error);
    
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
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    
    // Check if there are subcategories
    const hasSubcategories = await CategoryModel.exists({ parentId: params.id });
    
    if (hasSubcategories) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete a category that has subcategories. Delete or reassign subcategories first.' 
        },
        { status: 400 }
      );
    }
    
    // Check if there are products using this category
    // Uncomment and adjust if you have a product-category relationship
    /*
    const hasProducts = await ProductModel.exists({ categoryId: params.id });
    
    if (hasProducts) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete a category that has products. Reassign products first.' 
        },
        { status: 400 }
      );
    }
    */
    
    const deletedCategory = await CategoryModel.findByIdAndDelete(params.id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: params.id }
    });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}