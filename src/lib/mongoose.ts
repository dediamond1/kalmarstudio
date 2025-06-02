import mongoose, { Mongoose } from "mongoose";

interface CachedMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable not defined");
}

interface CustomGlobal {
  mongooseCache: CachedMongoose;
}

declare const global: CustomGlobal & typeof globalThis;

// Initialize cache if it doesn't exist
const cached: CachedMongoose =
  global.mongooseCache ||
  (global.mongooseCache = { conn: null, promise: null });

export async function connectToDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased from 5s to 10s
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = mongoose
      .connect(DATABASE_URL!, opts)
      .then((conn) => {
        console.log(
          "MongoDB connected successfully. Ready state:",
          conn.connection.readyState
        );
        return conn;
      })
      .catch((e) => {
        console.error("MongoDB connection error:", e);
        throw e; // Re-throw to prevent silent failures
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null; // Reset promise on error
    throw e;
  }
}
