'use client';

import { useMemo } from 'react';
import { AutoForm } from '@/components/auto-form';
import { useForm, useList, useResourceConfig, useShow } from '@/hooks';
import { cn } from '@/lib/utils';
import { DeleteButton } from '@/ui/buttons/delete';
import { EditButton } from '@/ui/buttons/edit';
import { ListButton } from '@/ui/buttons/list';
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
import { CreateView, CreateViewHeader } from '@/ui/views/create-view';
import { AdminDashboard } from '@/ui/views/dashboard-view';
import { EditView, EditViewHeader } from '@/ui/views/edit-view';
import { ListView, ListViewHeader } from '@/ui/views/list-view';
import { ShowView, ShowViewHeader } from '@/ui/views/show-view';

type ViewMode = 'dashboard' | 'list' | 'create' | 'edit' | 'show';

interface DynamicAdminPageProps {
  className?: string;
  params: {
    path?: string[];
  };
}

interface ParsedPath {
  recordId: string | null;
  resourceName: string | null;
  viewMode: ViewMode;
}

function parsePath(path: string[]): ParsedPath {
  if (path.length === 0) {
    return { resourceName: null, viewMode: 'dashboard', recordId: null };
  }

  const resourceName = path[0];

  if (path.length === 1) {
    return { resourceName, viewMode: 'list', recordId: null };
  }

  const action = path[1];

  if (action === 'create') {
    return { resourceName, viewMode: 'create', recordId: null };
  }

  if (action === 'edit' && path[2]) {
    return { resourceName, viewMode: 'edit', recordId: path[2] };
  }

  if ((action === 'show' || action === 'view') && path[2]) {
    return { resourceName, viewMode: 'show', recordId: path[2] };
  }

  if (path[1] && !['create', 'edit', 'show', 'view'].includes(path[1])) {
    return { resourceName, viewMode: 'show', recordId: path[1] };
  }

  return { resourceName, viewMode: 'list', recordId: null };
}

export function DynamicAdminPage({ params, className }: DynamicAdminPageProps) {
  const path = params?.path || [];
  const { resourceName, viewMode, recordId } = parsePath(path);

  if (viewMode === 'dashboard') {
    return (
      <div className={cn('p-6', className)}>
        <AdminDashboard />
      </div>
    );
  }

  if (!resourceName) {
    return (
      <div className={cn('p-6', className)}>
        <div className="text-destructive">Invalid resource</div>
      </div>
    );
  }

  return (
    <div className={cn('p-6', className)}>
      {viewMode === 'list' && <ListPageView resourceName={resourceName} />}
      {viewMode === 'create' && <CreatePageView resourceName={resourceName} />}
      {viewMode === 'edit' && recordId && (
        <EditPageView recordId={recordId} resourceName={resourceName} />
      )}
      {viewMode === 'show' && recordId && (
        <ShowPageView recordId={recordId} resourceName={resourceName} />
      )}
    </div>
  );
}

interface ListPageViewProps {
  resourceName: string;
}

function ListPageView({ resourceName }: ListPageViewProps) {
  const { config, loading: configLoading } = useResourceConfig(resourceName);
  const listResult = useList({
    resource: resourceName,
    pagination: { pageSize: 25 },
  });

  const records = (listResult.result?.data || []) as Record<string, unknown>[];
  const isLoading = listResult.query?.isPending || configLoading;

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
              <ShowButton recordItemId={recordId} resource={resourceName} />
              <EditButton recordItemId={recordId} resource={resourceName} />
              <DeleteButton recordItemId={recordId} resource={resourceName} />
            </div>
          </TableCell>
        </TableRow>
      );
    });
  }

  return (
    <ListView>
      <ListViewHeader canCreate={config?.canCreate ?? true} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {displayColumns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </div>
    </ListView>
  );
}

interface CreatePageViewProps {
  resourceName: string;
}

function CreatePageView({ resourceName }: CreatePageViewProps) {
  const { config, loading: configLoading } = useResourceConfig(resourceName);
  const { onFinish, formLoading } = useForm({
    resource: resourceName,
    action: 'create',
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    await onFinish(data);
  };

  if (configLoading || !config) {
    return (
      <CreateView>
        <CreateViewHeader />
        <div className="rounded-md border p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CreateView>
    );
  }

  return (
    <CreateView>
      <CreateViewHeader />
      <div className="rounded-md border p-6">
        <AutoForm
          isLoading={formLoading}
          mode="create"
          onSubmit={handleSubmit}
          resourceConfig={config}
        />
      </div>
    </CreateView>
  );
}

interface EditPageViewProps {
  recordId: string;
  resourceName: string;
}

function EditPageView({ resourceName, recordId }: EditPageViewProps) {
  const { config, loading: configLoading } = useResourceConfig(resourceName);
  const { query, formLoading, onFinish } = useForm({
    resource: resourceName,
    action: 'edit',
    id: recordId,
  });

  const record = query?.data?.data as Record<string, unknown> | undefined;

  const handleSubmit = async (data: Record<string, unknown>) => {
    await onFinish(data);
  };

  if (configLoading || !config || !record) {
    return (
      <EditView>
        <EditViewHeader />
        <div className="rounded-md border p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </EditView>
    );
  }

  return (
    <EditView>
      <EditViewHeader />
      <div className="rounded-md border p-6">
        <AutoForm
          initialData={record}
          isLoading={formLoading}
          mode="edit"
          onSubmit={handleSubmit}
          resourceConfig={config}
        />
      </div>
    </EditView>
  );
}

interface ShowPageViewProps {
  recordId: string;
  resourceName: string;
}

function ShowPageView({ resourceName, recordId }: ShowPageViewProps) {
  const { config, loading: configLoading } = useResourceConfig(resourceName);
  const { query } = useShow({
    resource: resourceName,
    id: recordId,
  });

  const record = query?.data?.data as Record<string, unknown> | undefined;

  const displayFields = useMemo(() => {
    if (!config?.fields) {
      return [];
    }
    return config.fields.filter((f) => !f.hidden);
  }, [config]);

  return (
    <ShowView>
      <ShowViewHeader />
      <div className="rounded-md border p-6">
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
          </div>
        )}
      </div>
    </ShowView>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return JSON.stringify(value).slice(0, 50);
  }
  return String(value).slice(0, 50);
}

export default DynamicAdminPage;
