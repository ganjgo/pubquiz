import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        if (username !== "rejd" || password !== "1234") {
          throw new Error("Pogresni podaci!");
        }

        return {
          id: "1234",
          name: "Rejd",
          email: "rejd@enterwell.com",
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt(params) {
      return params.token;
    },
  },
};

export default NextAuth(authOptions);
