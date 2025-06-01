import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Address from "../../../models/address";

export async function POST(request: Request) {
  try {
    const db = await connectToDB();
    if (!db || db.connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }

    const body = await request.json();
    const {
      email,
      fullName,
      contactNo,
      street,
      city,
      state,
      zipCode,
      country,
    } = body;

    // Validate required fields
    if (
      !email ||
      !fullName ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new address document
    const newAddress = await Address.create({
      email,
      fullName,
      contactNo: contactNo || "",
      street,
      city,
      state,
      zipCode,
      country,
    });

    return NextResponse.json({
      success: true,
      address: {
        ...newAddress.toObject(),
        _id: newAddress._id.toString(),
        email: newAddress.email,
        fullName: newAddress.fullName,
        contactNo: newAddress.contactNo,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zipCode,
        country: newAddress.country,
      },
    });
  } catch (error) {
    const errorBody = {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };
    console.error("Error saving address:", errorBody);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, stack: error.stack },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to save address", details: String(error) },
      { status: 500 }
    );
  }
}

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

    const addresses = await Address.find({ email }).lean();

    return NextResponse.json({
      success: true,
      addresses: Array.isArray(addresses) ? addresses : [],
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}
