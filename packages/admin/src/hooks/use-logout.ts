'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export interface UseLogoutResult {
  isPending: boolean;
  mutate: () => void;
}

export function useLogout(): UseLogoutResult {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(() => {
    setIsPending(true);

    // In a real implementation, this would call the auth provider's logout
    // For now, just redirect to login or home
    setTimeout(() => {
      setIsPending(false);
      router.push('/');
    }, 500);
  }, [router]);

  return {
    mutate,
    isPending,
  };
}
