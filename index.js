import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { requireAuth, requireRole } from "./middleware/auth.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.all("/api/auth/*splat", toNodeHandler(auth)); // if you're on Express 4, use "/api/auth/*"

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ResQLink server!");
});

app.get("/api/me", requireAuth, (req, res) => res.json(req.user));
app.get("/api/admin/ping", requireAuth, requireRole("admin"), (req, res) =>
  res.json({ ok: true })
);

app.listen(port, () => {
  console.log(`ResQLink app listening to port ${port}...`);
});

export default app;