'use client';

import { Counter } from "@/components/counter/Counter";
import { UsersCrud } from "@/components/users/UsersCrud";
import { Appbar } from "@/components/appbar/Appbar";
import AddProblem from "@/components/addProblem/AddProblem";
import HomePage from "@/components/home/HomePage";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-10">
      <Appbar/>
      {/* <UsersCrud /> */}
      {/* <Counter /> */}
      <AddProblem/>
      <HomePage/>

    </main>
  );
}

// my file structure 
// api 
//  - posts
//         - route.ts
//         - [id]
//                - comment
//                         -route.ts
//                         - [commentId]
//                               - route.ts
//                               - like
//                                   -route.ts
//                               - dislike
//                                   - route.ts
//                - upvote
//                         - route.ts