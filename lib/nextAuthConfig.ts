import type { NextAuthOptions, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma/userService"; // Adjust the path as needed

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
  
            return { id: user.id.toString(), name: user.name, email: user.email };
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
          token.name = user.name;
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          //@ts-ignore
          session.user.id = token.uid;
          session.user.name = token.name;
          session.user.email = token.email;
        }
        return session;
      },
    },
    pages: {
      signIn: "/api/auth/login", // Custom login page
    //   signOut: "/auth/signout", // (Optional) Custom sign-out page
    //   error: "/auth/error", // (Optional) Error page
    },
  };
  
