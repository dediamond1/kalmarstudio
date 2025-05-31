import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, items } = await request.json();
    const db = await connectToDB();
    console.log("MongoDB connection established for cart save");

    if (!db?.connection?.db) {
      console.error("MongoDB connection failed");
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 500 }
      );
    }

    const dbInstance = db.connection.db;
    console.log("Using database:", dbInstance.databaseName);

    // Ensure carts collection exists
    const collections = await dbInstance.listCollections().toArray();
    if (!collections.some((c) => c.name === "carts")) {
      console.log("Creating carts collection");
      await dbInstance.createCollection("carts");
    }

    const collection = dbInstance.collection("carts");
    console.log("Using collection:", collection.collectionName);

    const updateDoc = {
      userId,
      items,
      updatedAt: new Date(),
      createdAt: { $setOnInsert: new Date() },
    };

    const result = await collection.updateOne(
      { userId },
      { $set: updateDoc },
      { upsert: true }
    );

    console.log("Cart save result:", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      acknowledged: result.acknowledged,
    });

    if (!result.acknowledged) {
      throw new Error("MongoDB operation not acknowledged");
    }

    // Verify the document was actually saved
    const savedCart = await collection.findOne({ userId });
    console.log("Verified saved cart:", savedCart?.items?.length, "items");

    return NextResponse.json({
      success: true,
      cartId: result.upsertedId || savedCart?._id,
    });
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save cart" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = await connectToDB();
    if (!db?.connection?.db) {
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 500 }
      );
    }

    const cart = await db.connection.db.collection("carts").findOne({ userId });

    return NextResponse.json({
      success: true,
      items: cart?.items || [],
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const db = await connectToDB();

    if (!db?.connection?.db) {
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 500 }
      );
    }

    await db.connection.db.collection("carts").deleteOne({ userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
