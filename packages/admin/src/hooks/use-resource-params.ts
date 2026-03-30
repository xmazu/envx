'use client';

import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { ResolvedResource } from '@/lib/schema-types';
import type { BaseKey } from '@/types';
import { useResources } from './use-resources';

export interface UseResourceParamsOptions {
  resource?: string;
}

export interface UseResourceParamsResult {
  action?: string;
  id?: BaseKey;
  resource?: ResolvedResource;
}

export function useResourceParams(
  options?: UseResourceParamsOptions
): UseResourceParamsResult {
  const params = useParams();
  const pathname = usePathname();
  const { schema } = useResources();

  return useMemo(() => {
    if (options?.resource) {
      const resource = schema.resources.get(options.resource);
      return {
        resource,
        id: params?.id as BaseKey | undefined,
        action: params?.action as string | undefined,
      };
    }

    if (!pathname) {
      return {};
    }

    const segments = pathname.split('/').filter(Boolean);
    const resourceName = segments[0];

    if (resourceName) {
      const resource = schema.resources.get(resourceName);
      if (resource) {
        return {
          resource,
          id: params?.id as BaseKey | undefined,
          action: params?.action as string | undefined,
        };
      }
    }

    return {
      id: params?.id as BaseKey | undefined,
      action: params?.action as string | undefined,
    };
  }, [options?.resource, pathname, schema, params]);
}
