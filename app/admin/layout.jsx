import React from 'react';
import WorkspaceShell from '@/components/WorkspaceShell';

export default function AdminLayout({ children }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
