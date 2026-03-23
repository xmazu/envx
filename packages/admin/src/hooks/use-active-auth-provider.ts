'use client';

import { useMemo } from 'react';
import type { AuthProvider } from '@/types';

export function useActiveAuthProvider(): AuthProvider | undefined {
  return useMemo(() => {
    // In a real implementation, this would get the auth provider from context
    // For now, return undefined
    return undefined;
  }, []);
}
