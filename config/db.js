import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.MONGO_URI);

export const db = client.db("ResQLink");

export async function connectToMongoDB() {
  try {
    await client.connect();

    console.log("Successfully connected to MongoDB!");

    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}