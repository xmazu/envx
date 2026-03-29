'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useResourceConfig, useShow } from '@/hooks';
import { useResources } from '@/hooks/use-resources';
import { cn } from '@/lib/utils';
import { EditButton } from '@/ui/buttons/edit';
import { ListButton } from '@/ui/buttons/list';
import { Button } from '@/ui/shadcn/button';
import { Skeleton } from '@/ui/shadcn/skeleton';
import { ShowView, ShowViewHeader } from '@/ui/views/show-view';
import { formatCellValue } from './admin-utils';

interface ShowPageViewProps {
  recordId: string;
  resourceName: string;
}

export function ShowPageView({ resourceName, recordId }: ShowPageViewProps) {
  const { config, loading: configLoading } = useResourceConfig(resourceName);
  const { resources } = useResources();
  const { query } = useShow({
    resource: resourceName,
    id: recordId,
  });

  const record = query?.data?.data as Record<string, unknown> | undefined;
  const resource = resources.find((r) => r.name === resourceName);
  const nestedResources = resource?.nested;

  const displayFields = useMemo(() => {
    if (!config?.fields) {
      return [];
    }
    return config.fields.filter((f) => !f.hidden);
  }, [config]);

  return (
    <ShowView>
      <ShowViewHeader />
      <div className={cn('rounded-md border p-6')}>
        {configLoading || query.isLoading || !record ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {displayFields.map((field) => (
              <div
                className="flex justify-between border-b py-2"
                key={field.name}
              >
                <span className="font-medium text-muted-foreground">
                  {field.label || field.name}
                </span>
                <span>{formatCellValue(record[field.name])}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <EditButton recordItemId={recordId} resource={resourceName}>
                Edit
              </EditButton>
              <ListButton resource={resourceName} variant="outline">
                Back to List
              </ListButton>
            </div>
            {nestedResources && Object.keys(nestedResources).length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-3 font-medium text-muted-foreground text-sm">
                  Related Resources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(nestedResources).map(
                    ([name, nestedConfig]) => (
                      <Button asChild key={name} size="sm" variant="outline">
                        <Link href={`/${resourceName}/${recordId}/${name}`}>
                          View {nestedConfig.label}
                        </Link>
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ShowView>
  );
}
