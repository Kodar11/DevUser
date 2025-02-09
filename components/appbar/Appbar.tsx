"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from 'react';
import { FaPlus, FaTachometerAlt } from 'react-icons/fa';

export const Appbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
          DevUser
        </Link>

        {/* Search Bar */}
        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-md"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 md:hidden relative">
          <button onClick={toggleDropdown} className="hover:text-blue-400 transition">
            Menu
          </button>
          {isDropdownOpen && (
            <div className="absolute right-1 mt-[200px]  w-48 bg-gray-800 rounded-md shadow-lg">
              <Link href="/addProblem" className="block px-4 py-2 hover:bg-gray-700">
                <FaPlus className="inline mr-2" /> Post
              </Link>
              <Link href="/devdashboard" className="block px-4 py-2 hover:bg-gray-700">
                <FaTachometerAlt className="inline mr-2" /> Dashboard
              </Link>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-500"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-blue-500"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links for Larger Screens */}
        <div className="hidden md:flex items-center space-x-6">
          {session && (
            <>
              <Link href="/addProblem" className="hover:text-blue-400 transition">
                <FaPlus className="inline mr-2" /> Post
              </Link>
              <Link href="/devdashboard" className="hover:text-blue-400 transition">
                <FaTachometerAlt className="inline mr-2" /> Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
