import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export async function connectToMongoDB() {
  await client.connect(); 
  console.log("You successfully connected to MongoDB!");
  return client.db(); 
}