'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BaseRecord } from '@/server/data-provider';
import { useDataProvider } from './use-admin-context';

export interface UseFormConfig {
  action: 'create' | 'edit';
  id?: string | number;
  meta?: Record<string, unknown>;
  queryOptions?: {
    enabled?: boolean;
  };
  resource: string;
}

export interface UseFormResult<TData extends BaseRecord = BaseRecord> {
  formLoading: boolean;
  mutationResult?: {
    isSuccess: boolean;
    data?: TData;
  };
  onFinish: (values: Record<string, unknown>) => Promise<void>;
  query: {
    data?: { data: TData };
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
  };
}

export function useForm<TData extends BaseRecord = BaseRecord>(
  config: UseFormConfig
): UseFormResult<TData> {
  const dataProvider = useDataProvider();
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(config.action === 'edit');
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mutationData, setMutationData] = useState<TData | undefined>(
    undefined
  );

  // Fetch data for edit mode
  const fetchData = useCallback(async () => {
    if (config.action !== 'edit' || !config.id) {
      return;
    }

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
    config.action,
    config.id,
    config.meta,
    config.queryOptions?.enabled,
  ]);

  useEffect(() => {
    if (config.action === 'edit' && config.id) {
      fetchData();
    }
  }, [fetchData, config.action, config.id]);

  // Handle form submission
  const onFinish = useCallback(
    async (values: Record<string, unknown>) => {
      setFormLoading(true);
      setIsSuccess(false);
      setError(null);

      try {
        if (config.action === 'create') {
          const response = await dataProvider.create<TData>({
            resource: config.resource,
            variables: values,
            meta: config.meta,
          });
          setMutationData(response.data);
        } else if (config.action === 'edit' && config.id) {
          const response = await dataProvider.update<TData>({
            resource: config.resource,
            id: config.id,
            variables: values,
            meta: config.meta,
          });
          setMutationData(response.data);
        }
        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setFormLoading(false);
      }
    },
    [dataProvider, config.resource, config.action, config.id, config.meta]
  );

  return {
    query: {
      data: data ? { data } : undefined,
      isLoading,
      isError,
      error,
      refetch: fetchData,
    },
    formLoading,
    onFinish,
    mutationResult: {
      isSuccess,
      data: mutationData,
    },
  };
}
