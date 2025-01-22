"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Appbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    signIn(undefined, {
      callbackUrl: "/login", // Redirect to dashboard or any other page after login
    }).catch((error) => {
      console.error("Error during sign-in:", error);
    });
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/", // Redirect to home or any other page after logout
    });
    router.push("/"); // Ensure user is redirected to home
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      {session ? (
        <>
          <p>Welcome, {session.user?.name || session.user?.email}!</p>
          <button
            className="bg-red-500 px-4 py-2 rounded-md"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          className="bg-blue-500 px-4 py-2 rounded-md"
          onClick={handleSignIn}
        >
          Sign In
        </button>
      )}
    </div>
  );
};
