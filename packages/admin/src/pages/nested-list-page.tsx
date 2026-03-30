'use client';

import { useMemo } from 'react';
import { useList } from '@/hooks/use-list';
import { useResourceConfig } from '@/hooks/use-resource-config';
import { useResources } from '@/hooks/use-resources';
import { ShowButton } from '@/ui/buttons/show';
import { Skeleton } from '@/ui/shadcn/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/table';
import { ListView, ListViewHeader } from '@/ui/views/list-view';
import { formatCellValue } from './admin-utils';

interface NestedListPageViewProps {
  nestedResourceName: string;
  parentId: string;
  parentResourceName: string;
}

export function NestedListPageView({
  nestedResourceName,
  parentId,
  parentResourceName,
}: NestedListPageViewProps) {
  const { schema } = useResources();
  const nestedResource = schema.resources
    .get(parentResourceName)
    ?.nested.get(nestedResourceName);

  const parentField = nestedResource?.parentField ?? `${parentResourceName}_id`;

  const config = useResourceConfig(nestedResourceName);

  const filters = useMemo(
    () => [{ field: parentField, operator: 'eq', value: parentId }],
    [parentField, parentId]
  );

  const listResult = useList({
    resource: nestedResourceName,
    filters,
    pagination: { pageSize: 25 },
  });

  const records = (listResult.result?.data || []) as Record<string, unknown>[];
  const isLoading = listResult.query?.isPending;

  const displayColumns = useMemo(() => {
    if (!config?.list?.columns || config.list.columns.length === 0) {
      return ['id'];
    }
    return config.list.columns;
  }, [config]);

  function renderTableBody() {
    if (isLoading) {
      return (
        <TableRow>
          {displayColumns.map((column) => (
            <TableCell key={column}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
          <TableCell>
            <Skeleton className="h-8 w-20" />
          </TableCell>
        </TableRow>
      );
    }

    if (records.length === 0) {
      return (
        <TableRow>
          <TableCell
            className="h-24 text-center"
            colSpan={displayColumns.length + 1}
          >
            No records found.
          </TableCell>
        </TableRow>
      );
    }

    return records.map((record: Record<string, unknown>) => {
      const recordId = String(record.id ?? Math.random());
      return (
        <TableRow key={recordId}>
          {displayColumns.map((column) => (
            <TableCell key={column}>
              {formatCellValue(record[column])}
            </TableCell>
          ))}
          <TableCell>
            <div className="flex items-center gap-2">
              <ShowButton
                recordItemId={recordId}
                resource={nestedResourceName}
              />
            </div>
          </TableCell>
        </TableRow>
      );
    });
  }

  return (
    <ListView>
      <ListViewHeader
        canCreate={false}
        title={nestedResource?.label ?? nestedResourceName}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {displayColumns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </div>
    </ListView>
  );
}
