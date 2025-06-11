import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "../../../models/order";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Failed to connect to database");
    }

    const body = await request.json();
    const {
      items,
      shippingAddress,
      shippingMethod,
      payment,
      status,
      customerEmail,
    } = body;

    if (
      !items ||
      !shippingAddress ||
      !shippingMethod ||
      !payment ||
      !customerEmail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
