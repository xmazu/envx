import { useMemo } from 'react';
import type { ResolvedResource } from '@/lib/schema-types';
import { useResources } from './use-resources';

export function useResourceConfig(
  tableName: string
): ResolvedResource | undefined {
  const { schema } = useResources();

  return useMemo(() => {
    return schema.resources.get(tableName);
  }, [schema, tableName]);
}
