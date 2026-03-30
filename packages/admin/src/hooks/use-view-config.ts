'use client';

import { useMemo } from 'react';
import type { FieldRenderer, ResolvedViewConfig } from '@/lib/view-types';
import { useResources } from './use-resources';

export function useViewConfig(
  resourceName: string
): ResolvedViewConfig | undefined {
  const { resolvedViews } = useResources();

  return useMemo(() => {
    return resolvedViews[resourceName];
  }, [resolvedViews, resourceName]);
}

export function useFieldRenderer(
  resourceName: string,
  fieldName: string
): FieldRenderer | undefined {
  const viewConfig = useViewConfig(resourceName);

  return useMemo(() => {
    return viewConfig?.fields.find((f) => f.name === fieldName)?.render;
  }, [viewConfig, fieldName]);
}

export function useListSlots(resourceName: string) {
  const viewConfig = useViewConfig(resourceName);

  return useMemo(() => {
    return viewConfig?.list?.slots;
  }, [viewConfig]);
}

export function useShowSlots(resourceName: string) {
  const viewConfig = useViewConfig(resourceName);

  return useMemo(() => {
    return viewConfig?.show?.slots;
  }, [viewConfig]);
}
