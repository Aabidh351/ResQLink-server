import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { expo } from "@better-auth/expo";
import { jwt } from "better-auth/plugins";
import { db, client } from "./config/db.js";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "citizen",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  plugins: [
  expo(),
  jwt({
    jwt: {
      definePayload: ({ user }) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      role: user.role,
      }),
    },
  }),
],

  trustedOrigins: [
    "resqlink://",
    "exp://",
    "exp://**",
  ],
});