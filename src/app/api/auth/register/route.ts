import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, userId } = await request.json();

    console.log("Connecting to MongoDB with URL:", process.env.DATABASE_URL);
    const client = new MongoClient(process.env.DATABASE_URL as string);
    await client.connect();
    const db = client.db();

    // Verify collection exists
    const collections = await db.listCollections().toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    const collectionName = "users";
    if (!collections.some((c) => c.name === collectionName)) {
      console.log(`Creating '${collectionName}' collection`);
      await db.createCollection(collectionName);
    }

    // Upsert user profile with role="user"
    const result = await db.collection(collectionName).updateOne(
      { email },
      {
        $setOnInsert: {
          userId,
          email,
          name,
          role: "user",
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("MongoDB upsert result:", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      upsertedId: result.upsertedId,
    });

    // Verify user was created
    const user = await db.collection(collectionName).findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      throw new Error("User document not found after upsert");
    }

    await client.close();

    console.log("Registered user:", {
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err: unknown) {
    let errorMessage = "Registration failed";
    let errorStack: string | undefined;

    if (err instanceof Error) {
      errorMessage = err.message;
      errorStack = err.stack;
      console.error("Full registration error:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
    } else {
      console.error("Unknown error occurred:", err);
    }

    // Verify MongoDB connection string
    if (!process.env.DATABASE_URL) {
      errorMessage = "Database configuration error";
      console.error("DATABASE_URL is not set");
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
