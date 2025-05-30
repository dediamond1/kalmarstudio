import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  basePrice: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  printTypes: [{ 
    type: String 
  }],
  availableSizes: [{ 
    type: String 
  }],
  colors: [{ 
    type: String 
  }],
  materials: [{ 
    type: String 
  }],
  minOrderQuantity: { 
    type: Number, 
    default: 1,
    min: 1
  },
  imageUrls: [{ 
    type: String 
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Use existing model if available to prevent OverwriteModelError
export const ProductModel = models.Product || model('Product', ProductSchema);