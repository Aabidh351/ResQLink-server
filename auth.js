import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { expo } from "@better-auth/expo";
import { connectToMongoDB } from "./db.js";

const db = await connectToMongoDB();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "citizen", input: false },
      phone: { type: "string", required: false },
    },
  },
  plugins: [expo()],
  trustedOrigins: ["resqlink://"],
});