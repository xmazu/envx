'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { BaseKey, ButtonHookResult } from '@/types';
import { useResourceParams } from './use-resource-params';

export interface UseCreateButtonConfig {
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  meta?: Record<string, unknown>;
  resource?: BaseKey;
}

export function useCreateButton(
  config?: UseCreateButtonConfig
): ButtonHookResult {
  const { resource: currentResource } = useResourceParams();

  const resourceName = config?.resource ?? currentResource?.name ?? '';

  const to = useMemo(() => {
    if (typeof resourceName === 'string') {
      return `/${resourceName}/create`;
    }
    return '/';
  }, [resourceName]);

  return useMemo(
    () => ({
      hidden: false,
      disabled: false,
      label: 'Create',
      to,
      LinkComponent: Link,
    }),
    [to]
  );
}
