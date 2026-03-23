'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BaseRecord } from '@/server/data-provider';
import { useDataProvider } from './use-admin-context';

export interface UseShowConfig {
  id: string | number;
  meta?: Record<string, unknown>;
  queryOptions?: {
    enabled?: boolean;
  };
  resource: string;
}

export interface UseShowResult<TData extends BaseRecord = BaseRecord> {
  query: {
    data?: { data: TData };
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
  };
}

export function useShow<TData extends BaseRecord = BaseRecord>(
  config: UseShowConfig
): UseShowResult<TData> {
  const dataProvider = useDataProvider();
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (config.queryOptions?.enabled === false) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await dataProvider.getOne<TData>({
        resource: config.resource,
        id: config.id,
        meta: config.meta,
      });
      setData(response.data);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [
    dataProvider,
    config.resource,
    config.id,
    config.meta,
    config.queryOptions?.enabled,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    query: {
      data: data ? { data } : undefined,
      isLoading,
      isError,
      error,
      refetch: fetchData,
    },
  };
}
