'use client';

import { Appbar } from "@/components/appbar/Appbar";
import HomePage from "@/components/home/HomePage";

export default function Home() {
  return (
    <>
      <Appbar/>
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-10">
      <HomePage/>

    </main>
    </>
  );
}
