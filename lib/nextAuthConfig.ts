import type { NextAuthOptions, DefaultUser, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma/userService";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    username: string;
    role: string;
  }
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

          return { id: user.id, username: user.username, email: user.email, role: user.role as string };
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Authorization error:", error.message);
          } else {
            console.error("Authorization error:", error);
          }
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user}) {
      if (user) {
        token.uid = user.id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as number;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/api/auth/login",
  },
};
