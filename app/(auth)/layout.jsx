'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <header className="hairline-bottom py-5 px-6 sm:px-10 flex items-center justify-between">
          <Link href="/" className="font-editorial text-2xl font-medium tracking-tight text-[#1C1B18]">
            ReUse Campus
          </Link>
          <Link
            href="/"
            className="text-[11px] tracking-[0.14em] uppercase font-semibold text-[#7A746B] hover:text-[#1C1B18] transition-colors"
          >
            ← Back to Home
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">{children}</main>
      </div>
    </AuthProvider>
  );
}
