'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

function ProtectedShell({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4 bg-[#FAF8F5]">
        <div className="w-10 h-10 border-2 border-[#1C1B18] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center space-y-1">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#1C1B18]">
            Verifying Institutional Credentials
          </p>
          <p className="text-[12px] text-[#7A746B]">
            Loading member dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-3 bg-[#FAF8F5]">
        <div className="text-[12px] tracking-[0.16em] uppercase text-[#8A8276]">
          Redirecting to campus login...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />
      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default function WorkspaceShell({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <ProtectedShell>{children}</ProtectedShell>
      </SidebarProvider>
    </AuthProvider>
  );
}
