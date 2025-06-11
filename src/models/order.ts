import mongoose from "mongoose";

const shippingMethodSchema = new mongoose.Schema({
  type: { type: String, required: true },
  cost: { type: Number, required: true },
  estimatedDelivery: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      sizes: [
        {
          size: String,
          quantity: Number,
        },
      ],
      image: String,
    },
  ],
  shippingAddress: {
    fullName: String,
    email: String,
    contactNo: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  shippingMethod: shippingMethodSchema,
  payment: {
    amount: Number,
    currency: String,
    status: String,
  },
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now },
});

// Clear existing model if it exists
if (mongoose.models.Order) {
  mongoose.deleteModel("Order");
}

// Create new model
const Order = mongoose.model("Order", OrderSchema);
export default Order;
