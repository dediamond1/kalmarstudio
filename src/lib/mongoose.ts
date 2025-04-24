import mongoose, { Mongoose } from 'mongoose';

interface CachedMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable');
}

declare global {
  var mongooseCache: CachedMongoose;
}

let cached: CachedMongoose = global.mongooseCache || { conn: null, promise: null };

export async function connectToDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DATABASE_URL as string, opts);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}
