"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏀</span>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-blue-400">NBA</span>
              <span className="text-white">Tracker</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Features
            </Link>
            <Link
              href="#stats"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Stats
            </Link>
            <Link
              href="#how-it-works"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              How It Works
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-slate-400 hover:text-white text-sm transition-colors">
              Sign In
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link href="#features" onClick={() => setOpen(false)} className="text-slate-300 text-sm">Features</Link>
          <Link href="#stats" onClick={() => setOpen(false)} className="text-slate-300 text-sm">Stats</Link>
          <Link href="#how-it-works" onClick={() => setOpen(false)} className="text-slate-300 text-sm">How It Works</Link>
          <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg w-full">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
