import type { IResourceItem } from '@refinedev/core';
import { LayoutDashboard } from 'lucide-react';

/**
 * Resource configuration for Refine
 * This defines the resources that will be managed by the admin panel
 */
export const resources: IResourceItem[] = [
  {
    name: 'dashboard',
    list: '/',
    meta: {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
  },
];
