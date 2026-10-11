import React from 'react';
import WorkspaceShell from '@/components/WorkspaceShell';

export default function DashboardLayout({ children }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}