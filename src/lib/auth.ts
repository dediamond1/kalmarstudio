import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.DATABASE_URL as string);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    additionalUserFields: {
      role: {
        type: "string",
        required: true,
        default: "user",
      },
    },
    hooks: {
      beforeUserCreate: async (user: Record<string, unknown>) => {
        const newUser = {
          ...user,
          role: "user",
        };
        return newUser;
      },
    },
  },
});
