import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { authClient } from "@/lib/auth-client";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const client = new MongoClient(process.env.DATABASE_URL as string);
    await client.connect();
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection("user").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // First create auth user
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Then save user with role in MongoDB
    await db.collection("user").insertOne({
      userId: data.user.id,
      email,
      name,
      role: "admin", // Default role
      createdAt: new Date(),
    });

    await client.close();

    return NextResponse.json({
      success: true,
      userId: data.user.id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
