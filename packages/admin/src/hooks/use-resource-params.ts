'use client';

import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { BaseKey } from '@/types';
import type { ResourceItem } from '@/types/resources';
import { useResources } from './use-resources';

export interface UseResourceParamsOptions {
  resource?: string;
}

export interface UseResourceParamsResult {
  action?: string;
  id?: BaseKey;
  resource?: ResourceItem;
}

export function useResourceParams(
  options?: UseResourceParamsOptions
): UseResourceParamsResult {
  const params = useParams();
  const pathname = usePathname();
  const { resources } = useResources();

  return useMemo(() => {
    // If resource is provided in options, use that
    if (options?.resource) {
      const resource = resources.find((r) => r.name === options.resource);
      return {
        resource,
        id: params?.id as BaseKey | undefined,
        action: params?.action as string | undefined,
      };
    }

    // Otherwise, infer from pathname
    if (!pathname) {
      return {};
    }

    // Parse pathname to find resource
    const segments = pathname.split('/').filter(Boolean);

    // Find matching resource
    for (const resource of resources) {
      if (
        resource.list &&
        pathname.startsWith(resource.list.replace('/:id?', ''))
      ) {
        return {
          resource,
          id: params?.id as BaseKey | undefined,
          action: params?.action as string | undefined,
        };
      }

      // Check if pathname matches any resource route pattern
      const resourceName = resource.name;

      // Check for exact match or sub-routes
      if (segments[0] === resourceName) {
        return {
          resource,
          id: params?.id as BaseKey | undefined,
          action: params?.action as string | undefined,
        };
      }
    }

    // Default: return empty if no match
    return {
      id: params?.id as BaseKey | undefined,
      action: params?.action as string | undefined,
    };
  }, [options?.resource, pathname, resources, params]);
}
