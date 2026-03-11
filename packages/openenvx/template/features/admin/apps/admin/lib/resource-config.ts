import type { ResourceProps } from '@refinedev/core';
import {
  FileText,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Users,
} from 'lucide-react';

export interface ResourceConfig extends ResourceProps {
  hidden?: boolean;
  icon?: LucideIcon;
  label: string;
}

export const resources: ResourceConfig[] = [
  {
    name: 'dashboard',
    list: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    hidden: false,
  },
  {
    name: 'users',
    list: '/users',
    create: '/users/create',
    edit: '/users/edit/:id',
    show: '/users/show/:id',
    label: 'Users',
    icon: Users,
  },
  {
    name: 'posts',
    list: '/posts',
    create: '/posts/create',
    edit: '/posts/edit/:id',
    show: '/posts/show/:id',
    label: 'Posts',
    icon: FileText,
  },
  {
    name: 'settings',
    list: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function getResourceByName(name: string): ResourceConfig | undefined {
  return resources.find((r) => r.name === name);
}

export function getVisibleResources(): ResourceConfig[] {
  return resources.filter((r) => !r.hidden);
}
