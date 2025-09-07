// components/Header.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-green-500">
          CodeSprint
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-300">
          <Link href="/products" className="hover:text-white">
            Products
          </Link>
          <Link href="/solutions" className="hover:text-white">
            Solutions
          </Link>
          <Link href="/resources" className="hover:text-white">
            Resources
          </Link>
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link href="/developers" className="hover:text-white">
            For Developers
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-transparent"
          >
            Log in
          </Button>
          <Button
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
          >
            Request Demo
          </Button>
          <Button className="bg-green-500 text-black hover:bg-green-600">
            Create a free account
          </Button>
        </div>
      </div>
    </header>
  );
}
