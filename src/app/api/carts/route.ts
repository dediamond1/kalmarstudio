import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/models/cart";

export async function GET(request: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("userId");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: email });

    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json({
      items: cart.items,
    });
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
