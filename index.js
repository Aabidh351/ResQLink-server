import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToMongoDB } from "./config/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ResQLink server!");
});

async function startServer() {
  await connectToMongoDB();

  app.listen(port, () => {
    console.log(`ResQLink server listening on port ${port}...`);
  });
}

startServer();