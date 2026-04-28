import mongoose from "mongoose";
import { getEnv } from "@/lib/env";

const MONGODB_URI = getEnv().MONGODB_URI;

declare global {
  var mongooseConn:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseConn || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "property_dealer_crm",
    });
  }

  cached.conn = await cached.promise;
  global.mongooseConn = cached;

  return cached.conn;
}
