'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { BaseKey, ButtonHookResult } from '@/types';
import { useResourceParams } from './use-resource-params';

export interface UseCloneButtonConfig {
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  id?: BaseKey;
  meta?: Record<string, unknown>;
  resource?: string;
}

export function useCloneButton(
  config?: UseCloneButtonConfig
): ButtonHookResult {
  const { resource: currentResource, id: currentId } = useResourceParams();

  const resourceName = config?.resource ?? currentResource?.name ?? '';
  const id = config?.id ?? currentId;

  const to = useMemo(() => {
    if (typeof resourceName === 'string' && id) {
      return `/${resourceName}/create?clone=${id}`;
    }
    return '/';
  }, [resourceName, id]);

  return useMemo(
    () => ({
      hidden: !id,
      disabled: false,
      label: 'Clone',
      to,
      LinkComponent: Link,
    }),
    [id, to]
  );
}
