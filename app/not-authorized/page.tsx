"use client";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-700 mb-6 text-center max-w-md">
        Only admins can log in to this site.<br />
        <b>If you want to buy books:</b> Just add products to your cart and fill in your details at checkout—no login is required for customers.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Go to Home</Link>
        <SignOutButton>
          <button className="bg-red-600 text-white px-4 py-2 rounded">Sign Out</button>
        </SignOutButton>
      </div>
    </div>
  );
} 