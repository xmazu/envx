'use client';

import { useMemo } from 'react';
import type { AdminOptions } from '@/types';

const defaultOptions: AdminOptions = {
  title: {
    text: 'Admin',
    icon: null,
  },
};

export interface UseAdminOptionsResult {
  options: AdminOptions;
  title: {
    icon: React.ReactNode;
    text: string;
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
