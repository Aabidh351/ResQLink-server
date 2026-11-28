import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToMongoDB } from "./config/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { authenticate } from "./middleware/authenticate.js";
import assistanceRoutes from "./routes/assistance.routes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ResQLink server!");
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user,
  });
});

app.use("/api/assistance", assistanceRoutes);

async function startServer() {
  await connectToMongoDB();

  app.listen(port, () => {
    console.log(`ResQLink server listening on port ${port}...`);
  });
}

startServer();