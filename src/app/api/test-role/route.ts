import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = new MongoClient(process.env.DATABASE_URL as string);
    await client.connect();
    const db = client.db();

    // Test inserting user with role directly
    // Insert test user with admin role
    await db.collection("users").insertOne({
      email: "admin@example.com",
      name: "Admin User",
      password: "hashed_password",
      role: "admin",
      createdAt: new Date(),
      permissions: ["read", "write", "delete"],
    });

    // Insert test user with regular user role
    await db.collection("users").insertOne({
      email: "user@example.com",
      name: "Regular User",
      password: "hashed_password",
      role: "user",
      createdAt: new Date(),
      permissions: ["read"],
    });

    // Verify both inserted users
    const adminUser = await db.collection("users").findOne({ role: "admin" });
    const regularUser = await db.collection("users").findOne({ role: "user" });

    await client.close();

    return NextResponse.json({
      success: true,
      adminUser: {
        exists: !!adminUser,
        permissions: adminUser?.permissions,
      },
      regularUser: {
        exists: !!regularUser,
        permissions: regularUser?.permissions,
      },
      rolesVerified: !!adminUser && !!regularUser,
    });
  } catch (err) {
    console.error("Test role insert error:", err);
    return NextResponse.json(
      { success: false, error: "Test failed" },
      { status: 500 }
    );
  }
}
