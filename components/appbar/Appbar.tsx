"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Appbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    signIn(undefined, {
      callbackUrl: "/dashboard",
    }).catch((error) => {
      console.error("Error during sign-in:", error);
    });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
          DevUser
        </Link>

        {/* Navigation Links */}
        {session && (
          <div className="hidden md:flex space-x-6">
            <Link href="/addProblem" className="hover:text-blue-400 transition">Post</Link>
            <Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
          </div>
        )}

        {/* Auth Buttons */}
        <div>
          {session ? (
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
