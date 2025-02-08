import type { NextAuthOptions, User } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma/userService";


interface CustomUser extends User {
  id: string;
}

export const NEXT_AUTH_CONFIG: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("User not found");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return { id: user.id.toString(), username: user.username, email: user.email, role: user.role };
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
        //@ts-ignore
        token.username = user.username;
        token.email = user.email;
        //@ts-ignore
        token.role = user.role;  // ✅ Add role here
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        //@ts-ignore
        session.user.id = token.uid;
        //@ts-ignore
        session.user.username = token.username;
        session.user.email = token.email;
        //@ts-ignore
        session.user.role = token.role;  // ✅ Add role here
      }
      return session;
    }
    ,
  },
  pages: {
    signIn: "/api/auth/login", // Custom login page
    // signOut: "/auth/signout", // (Optional) Custom sign-out page
    // error: "/auth/error", // (Optional) Error page
  },
};
