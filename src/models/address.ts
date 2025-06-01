import mongoose, { Schema, model } from "mongoose";

const addressSchema = new Schema({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  contactNo: { type: String, default: "" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if model already exists before compiling
export default mongoose.models?.Address || model("Address", addressSchema);
