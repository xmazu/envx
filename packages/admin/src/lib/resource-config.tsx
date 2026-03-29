import { LayoutDashboard } from 'lucide-react';
import type { ResourceItem } from '@/types/resources';

export const resources: ResourceItem[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    list: '/',
    meta: {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
  },
];
