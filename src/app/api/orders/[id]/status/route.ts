import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "../../../../../models/order";
import mongoose from "mongoose";

const validStatuses = [
  "pending",
  "confirmed",
  "processing",
  "prepared",
  "shipped",
  "transit",
  "delivery",
  "delivered",
  "out_for_delivery",
  "failed_attempt",
  "returned_to_sender",
  "cancelled",
  "refunded",
] as const;

import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/")[3];
  try {
    // Verify DB connection
    const db = await connectToDB();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Verify Order model exists
    if (!Order) {
      throw new Error("Order model not found");
    }

    // Parse request body once
    const requestBody = await request.json();
    console.log("Request URL:", request.url);
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const { status } = requestBody;
    const trimmedId = id.trim();
    console.log("Trimmed ID:", trimmedId);

    // Convert to ObjectId early with validation
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const objectId = new mongoose.Types.ObjectId(trimmedId);
    console.log("Converted ObjectId:", objectId);

    if (!trimmedId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    // Strict validation for MongoDB ObjectId
    const isValidObjectId =
      mongoose.Types.ObjectId.isValid(trimmedId) &&
      trimmedId.match(/^[0-9a-fA-F]{24}$/) !== null;

    console.log("ID validation:", {
      id: trimmedId,
      length: trimmedId.length,
      isValid: isValidObjectId,
    });

    if (!isValidObjectId) {
      return NextResponse.json(
        {
          error: "Invalid order ID",
          details: "ID must be a 24 character hex string",
        },
        { status: 400 }
      );
    }
    const normalizedStatus =
      status?.toLowerCase() as (typeof validStatuses)[number];
    if (!normalizedStatus || !validStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        { error: "Invalid or missing status" },
        { status: 400 }
      );
    }

    console.log("Updating order with ObjectId:", objectId);
    const updatedOrder = await Order.findByIdAndUpdate(
      objectId,
      { status: normalizedStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      {
        error: "Failed to update order status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
