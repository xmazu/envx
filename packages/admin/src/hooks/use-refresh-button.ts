'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import type { BaseKey, RefreshButtonHookResult } from '@/types';
import { useDataProvider } from './use-admin-context';

export interface UseRefreshButtonConfig {
  dataProviderName?: string;
  id?: BaseKey;
  meta?: Record<string, unknown>;
  resource?: string;
}

export function useRefreshButton(
  config?: UseRefreshButtonConfig
): RefreshButtonHookResult {
  const dataProvider = useDataProvider();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(async () => {
    if (!(config?.resource && config?.id)) {
      // Just refresh the page if no resource/id
      router.refresh();
      return;
    }

    setLoading(true);
    try {
      // Re-fetch the data
      await dataProvider.getOne({
        resource: config.resource,
        id: config.id,
        meta: config.meta,
      });
    } finally {
      setLoading(false);
    }
  }, [config?.resource, config?.id, config?.meta, dataProvider, router]);

  return useMemo(
    () => ({
      loading,
      label: 'Refresh',
      onClick,
    }),
    [loading, onClick]
  );
}
