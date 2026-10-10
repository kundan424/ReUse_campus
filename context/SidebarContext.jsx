'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext({
  isOpen: true,
  setIsOpen: () => {},
  toggleSidebar: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
  toggleMobileSidebar: () => {},
  closeMobileSidebar: () => {},
  activeTab: 'overview',
  setActiveTab: () => {},
});

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTabState] = useState('overview');

  // Read initial tab from URL if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTabState(tab);
      }
    }
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  const setActiveTab = (tabName) => {
    setActiveTabState(tabName);
    setIsMobileOpen(false);

    if (typeof window !== 'undefined') {
      const isDashboard = window.location.pathname === '/dashboard';
      if (isDashboard) {
        const newUrl = tabName === 'overview' ? '/dashboard' : `/dashboard?tab=${tabName}`;
        window.history.replaceState(null, '', newUrl);
      } else {
        // If on another page, navigate to dashboard with tab
        window.location.href = tabName === 'overview' ? '/dashboard' : `/dashboard?tab=${tabName}`;
      }
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleSidebar,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
