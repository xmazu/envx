import { LayoutDashboard } from 'lucide-react';
import type { IResourceItem } from '@/types';

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
