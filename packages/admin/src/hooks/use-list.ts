'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  BaseRecord,
  CrudFilter,
  GetListParams,
  Sorter,
} from '@/server/data-provider';
import { useDataProvider } from './use-admin-context';

export interface UseListConfig {
  filters?: CrudFilter[];
  meta?: Record<string, unknown>;
  pagination?: {
    pageSize?: number;
    current?: number;
  };
  queryOptions?: {
    enabled?: boolean;
  };
  resource: string;
  sorters?: Sorter[];
}

export interface UseListResult<TData extends BaseRecord = BaseRecord> {
  query: {
    isPending: boolean;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
  };
  result: {
    data: TData[];
    total?: number;
  };
}

export function useList<TData extends BaseRecord = BaseRecord>(
  config: UseListConfig
): UseListResult<TData> {
  const dataProvider = useDataProvider();
  const [data, setData] = useState<TData[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (config.queryOptions?.enabled === false) {
      return;
    }

    setIsPending(true);
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const params: GetListParams = {
        resource: config.resource,
        pagination: {
          pageSize: config.pagination?.pageSize ?? 25,
          current: config.pagination?.current ?? 1,
        },
        filters: config.filters,
        sorters: config.sorters,
        meta: config.meta,
      };

      const response = await dataProvider.getList<TData>(params);
      setData(response.data);
      setTotal(response.total);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsPending(false);
      setIsLoading(false);
    }
  }, [
    dataProvider,
    config.resource,
    config.pagination?.pageSize,
    config.pagination?.current,
    config.filters,
    config.sorters,
    config.meta,
    config.queryOptions?.enabled,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    result: {
      data,
      total,
    },
    query: {
      isPending,
      isLoading,
      isError,
      error,
      refetch: fetchData,
    },
  };
}
