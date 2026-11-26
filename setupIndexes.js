import { db } from "./config/db.js";

export async function setupIndexes() {
  const requests = db.collection("emergencyRequests");
  await requests.createIndex({ publicLocation: "2dsphere" });
  await requests.createIndex({ requesterId: 1, createdAt: -1 });
  await requests.createIndex({ status: 1, createdAt: -1 });
}