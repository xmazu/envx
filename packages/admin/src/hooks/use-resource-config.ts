import { useMemo } from 'react';
import type { ResourceConfig } from '@/lib/resource-types';
import { useResources } from './use-resources';

export function useResourceConfig(
  tableName: string
): ResourceConfig | undefined {
  const { resources } = useResources();

  return useMemo(() => {
    const resource = resources.find((r) => r.name === tableName);
    return resource?.config as ResourceConfig | undefined;
  }, [resources, tableName]);
}
