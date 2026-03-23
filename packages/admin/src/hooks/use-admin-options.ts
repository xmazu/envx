'use client';

import { useMemo } from 'react';
import { resources } from '@/lib/resource-config';
import type { AdminOptions } from '@/types';

const defaultOptions: AdminOptions = {
  title: {
    text: 'Admin',
    icon: null,
  },
  resources,
};

export interface UseAdminOptionsResult {
  options: AdminOptions;
  title: {
    text: string;
    icon: React.ReactNode;
  };
}

export function useAdminOptions(): UseAdminOptionsResult {
  return useMemo(() => {
    return {
      title: {
        text: defaultOptions.title?.text ?? 'Admin',
        icon: defaultOptions.title?.icon ?? null,
      },
      options: defaultOptions,
    };
  }, []);
}
