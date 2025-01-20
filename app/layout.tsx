import './globals.css';
import { Inter } from 'next/font/google';
import  StoreProvider  from "./StoreProvider";
import type { ReactNode } from "react";

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
  return (
    <StoreProvider>
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
    </StoreProvider>
      
  );
}
