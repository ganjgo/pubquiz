import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
          name: "Mujo",
          email: "mujo@gmail.com",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
  callbacks: {
    jwt(params) {
      return params.token;
    },
  },
};

export default NextAuth(authOptions);
