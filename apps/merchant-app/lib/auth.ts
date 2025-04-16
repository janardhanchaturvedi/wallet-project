import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";
import { AuthType } from "@prisma/client"; // optional if using enum for auth_type

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("hi signin");

      if (!user?.email || !account?.provider) {
        return false;
      }

      await db.merchant.upsert({
        select: { id: true },
        where: { email: user.email },
        create: {
          email: user.email,
          name: user.name ?? "",
          auth_type:
            account.provider === "google"
              ? "Google"
              : "Github", // or AuthType.Google / AuthType.Github
        },
        update: {
          name: user.name ?? "",
          auth_type:
            account.provider === "google"
              ? "Google"
              : "Github",
        },
      });

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
};
