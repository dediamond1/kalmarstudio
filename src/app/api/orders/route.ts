import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "../../../models/order";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectToDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Failed to connect to database");
    }
    console.log("Connected to DB");

    const body = await request.json();
    console.log("Request body:", body);

    const {
      items,
      shippingAddress,
      shippingMethod,
      payment,
      status,
      customerEmail,
    } = body;

    // Validate required fields
    if (
      !items ||
      !shippingAddress ||
      !shippingMethod ||
      !payment ||
      !customerEmail
    ) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating new order...");
    // Create new order
    const newOrder = await Order.create({
      customerEmail,
      items,
      shippingAddress,
      shippingMethod,
      payment,
      status: status || "Processing",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
