'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { BreadcrumbItem } from '@/types';

export interface UseBreadcrumbResult {
  breadcrumbs: BreadcrumbItem[];
}

export function useBreadcrumb(): UseBreadcrumbResult {
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname) {
      return { breadcrumbs: [] };
    }

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    for (const segment of segments) {
      currentPath += `/${segment}`;

      // Format the label
      const label = segment
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    }

    return { breadcrumbs };
  }, [pathname]);
}
