'use client';

import { Counter } from "@/components/counter/Counter";
import { UsersCrud } from "@/components/users/UsersCrud";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-10">
      <UsersCrud />
      <Counter />
    </main>
  );
}
