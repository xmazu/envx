'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useBack(): () => void {
  const router = useRouter();

  return useCallback(() => {
    router.back();
  }, [router]);
}
