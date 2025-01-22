"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = (e.target as HTMLFormElement).email.value;
          const password = (e.target as HTMLFormElement).password.value;

          signIn("credentials", {
            email,
            password,
            callbackUrl: "/", // Redirect after login
          });
        }}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Sign In
        </button>
        <p className="text-center">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
