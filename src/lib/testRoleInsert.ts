import { MongoClient } from "mongodb";

async function testRoleInsert() {
  const client = new MongoClient(process.env.DATABASE_URL as string);
  try {
    await client.connect();
    const db = client.db();

    // Test inserting user with role directly
    const result = await db.collection("users").insertOne({
      email: "test@example.com",
      name: "Test User",
      password: "hashed_password",
      role: "user",
      createdAt: new Date(),
    });

    console.log("Insert result:", result);

    // Verify the inserted document
    const user = await db
      .collection("users")
      .findOne({ _id: result.insertedId });
    console.log("Retrieved user:", user);
    console.log("Role exists:", user?.role === "user");
  } finally {
    await client.close();
  }
}

testRoleInsert().catch(console.error);
