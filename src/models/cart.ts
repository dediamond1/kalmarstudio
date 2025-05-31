import mongoose from "mongoose";

const CartItemSizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  color: String,
  printType: String,
  material: String,
  sizes: { type: [CartItemSizeSchema], required: true },
  totalQuantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email"],
  },
  items: { type: [CartItemSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CartSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
