'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function AppShell({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Landing page and auth pages stay full-width
  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const showSidebar = Boolean(user && !isLandingPage && !isAuthPage);

  return (
    <div className="flex-1 flex w-full">
      {showSidebar && <Sidebar />}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
