// "use client"
import './globals.css';
import { Inter } from 'next/font/google';
import StoreProvider from "./StoreProvider";
import type { ReactNode } from "react";
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Solutions ", href: "/addsolution" }
]

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js Redux App',
  description: 'A Next.js app with Redux setup',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // const pathname = usePathname()
  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link href={link.href} key={link.name}
              className={isActive ? "font-bold mr-4 ":"text-blue-500 mr-4"}>
                {link.name}
              </Link>
            )
          })} */}
          {children}
        </body>
      </html>
    </StoreProvider>

  );
}


// /your-project
// │
// ├── /app
// │   ├── /page.tsx                # Main entry file (e.g., Home component with CRUD UI)
// │   ├── /layout.tsx              # Layout component for app-wide styling or structure
// │   └── /store-provider.tsx      # Store provider to wrap the app with Redux provider
// │
// ├── /components
// │   ├── /counter
// │   │   └── /Counter.tsx         # Counter component
// │   ├── /quotes
// │   │   └── /Quotes.tsx          # Quotes component
// │   └── /users
// │       └── /UsersCrud.tsx       # User CRUD UI component
// │
// ├── /lib
// │   ├── /prisma
// │   │   └── /userService.ts      # Prisma service for user database operations
// │   ├── /redux
// │   │   ├── /features
// │   │   │   ├── /count
// │   │   │   │   └── /counterSlice.ts  # Redux slice for counter state
// │   │   │   └── /users
// │   │   │       └── /usersApiSlice.ts  # Redux slice for managing user API calls
// │   │   ├── /createAppSlice.ts   # Helper to create app slices
// │   │   └── /store.ts            # Store configuration and types
// │   └── /utils
// │       └── /helpers.ts          # Utility functions if needed
// │
// ├── /pages
// │   ├── /api
// │   │   ├── /users.ts            # API route for user CRUD operations (GET, POST)
// │   │   ├── /users/[id].ts       # API route for individual user (GET, PUT, DELETE)
// │   └── /_app.tsx                # Custom app component (App wrapper for context providers)
// │
// ├── /public
// │   └── /assets                  # Static files like images, fonts, etc.
// │
// ├── /styles
// │   └── /globals.css             # Global styles and theme configurations
// │
// ├── /types
// │   └── /user.d.ts               # Type definitions for User (if required)
// │
// └── package.json                 # Project dependencies and scripts

