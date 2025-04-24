import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },
  description: { 
    type: String 
  },
  parentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  }
}, { 
  timestamps: true 
});

// Set up virtual population for subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId'
});

// Add toJSON configuration to include virtuals
CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

// Use existing model if available to prevent OverwriteModelError
export const CategoryModel = models.Category || model('Category', CategorySchema);