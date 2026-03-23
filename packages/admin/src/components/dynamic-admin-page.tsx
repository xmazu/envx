'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useList, useShow } from '@/hooks';
import { cn } from '@/lib/utils';
import { DeleteButton } from '@/ui/buttons/delete';
import { EditButton } from '@/ui/buttons/edit';
import { ListButton } from '@/ui/buttons/list';
import { ShowButton } from '@/ui/buttons/show';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import { Label } from '@/ui/shadcn/label';
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
  /** URL path segments from Next.js catch-all route */
  params: {
    path?: string[];
  };
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
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

  // If second segment looks like an ID, treat as show view
  if (path[1] && !['create', 'edit', 'show', 'view'].includes(path[1])) {
    return { resourceName, viewMode: 'show', recordId: path[1] };
  }

  return { resourceName, viewMode: 'list', recordId: null };
}

export function DynamicAdminPage({ params, className }: DynamicAdminPageProps) {
  const path = params?.path || [];
  const { resourceName, viewMode, recordId } = parsePath(path);

  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [columnsError, setColumnsError] = useState<string | null>(null);

  // Fetch columns for the resource
  useEffect(() => {
    if (!resourceName) {
      return;
    }

    async function fetchColumns() {
      setColumnsLoading(true);
      setColumnsError(null);
      try {
        const response = await fetch(
          `/api/admin/introspection/columns/${resourceName}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch columns');
        }
        const data = await response.json();
        setColumns(data);
      } catch (err) {
        setColumnsError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setColumnsLoading(false);
      }
    }

    fetchColumns();
  }, [resourceName]);

  // Dashboard view
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

  // Render the appropriate view
  return (
    <div className={cn('p-6', className)}>
      {viewMode === 'list' && (
        <ListPageView
          columns={columns}
          columnsError={columnsError}
          columnsLoading={columnsLoading}
          resourceName={resourceName}
        />
      )}
      {viewMode === 'create' && (
        <CreatePageView
          columns={columns}
          columnsLoading={columnsLoading}
          resourceName={resourceName}
        />
      )}
      {viewMode === 'edit' && recordId && (
        <EditPageView
          columns={columns}
          columnsLoading={columnsLoading}
          recordId={recordId}
          resourceName={resourceName}
        />
      )}
      {viewMode === 'show' && recordId && (
        <ShowPageView
          columns={columns}
          columnsLoading={columnsLoading}
          recordId={recordId}
          resourceName={resourceName}
        />
      )}
    </div>
  );
}

// List View Component
interface ListPageViewProps {
  columns: ColumnInfo[];
  columnsError: string | null;
  columnsLoading: boolean;
  resourceName: string;
}

function ListPageView({
  resourceName,
  columns,
  columnsLoading,
  columnsError,
}: ListPageViewProps) {
  const listResult = useList({
    resource: resourceName,
    pagination: {
      pageSize: 25,
    },
  });

  const records = (listResult.result?.data || []) as Record<string, unknown>[];
  const isLoading = listResult.query?.isPending || columnsLoading;

  const displayColumns = useMemo(() => {
    if (columns.length === 0) {
      return [];
    }
    // Filter out common internal columns for display
    return columns
      .filter(
        (col) => !['id', 'created_at', 'updated_at'].includes(col.column_name)
      )
      .slice(0, 5);
  }, [columns]);

  function renderTableContent() {
    if (isLoading) {
      return (
        <TableRow>
          {displayColumns.map((column) => (
            <TableCell key={column.column_name}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
          <TableCell>
            <Skeleton className="h-8 w-20" />
          </TableCell>
        </TableRow>
      );
    }

    if (columnsError) {
      return (
        <TableRow>
          <TableCell
            className="h-24 text-center text-destructive"
            colSpan={displayColumns.length + 1}
          >
            Error loading columns: {columnsError}
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
      const recordId = String(record.id ?? record.uuid ?? Math.random());
      return (
        <TableRow key={recordId}>
          {displayColumns.map((column) => (
            <TableCell key={column.column_name}>
              {formatCellValue(record[column.column_name])}
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
      <ListViewHeader canCreate />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {displayColumns.map((column) => (
                <TableHead key={column.column_name}>
                  {column.column_name}
                </TableHead>
              ))}
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>
    </ListView>
  );
}

// Create View Component
interface CreatePageViewProps {
  columns: ColumnInfo[];
  columnsLoading: boolean;
  resourceName: string;
}

function CreatePageView({
  resourceName,
  columns,
  columnsLoading,
}: CreatePageViewProps) {
  const { onFinish, formLoading } = useForm({
    resource: resourceName,
    action: 'create',
  });

  const formColumns = useMemo(() => {
    return columns.filter(
      (col) =>
        !['id', 'created_at', 'updated_at'].includes(col.column_name) &&
        col.column_name !== 'id'
    );
  }, [columns]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    for (const col of formColumns) {
      const value = formData.get(col.column_name);
      if (value !== null && value !== '') {
        data[col.column_name] = value;
      }
    }
    await onFinish(data);
  }

  return (
    <CreateView>
      <CreateViewHeader />
      <div className="rounded-md border p-6">
        {columnsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {formColumns.map((column) => (
              <div className="space-y-2" key={column.column_name}>
                <Label htmlFor={column.column_name}>
                  {column.column_name}
                  {!column.is_nullable && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                <Input
                  disabled={formLoading}
                  id={column.column_name}
                  name={column.column_name}
                  required={!column.is_nullable}
                  type={getInputType(column.data_type)}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button disabled={formLoading} type="submit">
                {formLoading ? 'Creating...' : 'Create'}
              </Button>
              <ListButton resource={resourceName} variant="outline">
                Cancel
              </ListButton>
            </div>
          </form>
        )}
      </div>
    </CreateView>
  );
}

// Edit View Component
interface EditPageViewProps {
  columns: ColumnInfo[];
  columnsLoading: boolean;
  recordId: string;
  resourceName: string;
}

function EditPageView({
  resourceName,
  recordId,
  columns,
  columnsLoading,
}: EditPageViewProps) {
  const { query, formLoading, onFinish } = useForm({
    resource: resourceName,
    action: 'edit',
    id: recordId,
  });

  const record = query?.data?.data as Record<string, unknown> | undefined;

  const formColumns = useMemo(() => {
    return columns.filter(
      (col) => !['id', 'created_at', 'updated_at'].includes(col.column_name)
    );
  }, [columns]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    for (const col of formColumns) {
      const value = formData.get(col.column_name);
      if (value !== null) {
        data[col.column_name] = value;
      }
    }
    await onFinish(data);
  }

  return (
    <EditView>
      <EditViewHeader />
      <div className="rounded-md border p-6">
        {columnsLoading || !record ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {formColumns.map((column) => (
              <div className="space-y-2" key={column.column_name}>
                <Label htmlFor={column.column_name}>{column.column_name}</Label>
                <Input
                  defaultValue={String(record[column.column_name] ?? '')}
                  disabled={formLoading}
                  id={column.column_name}
                  name={column.column_name}
                  type={getInputType(column.data_type)}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button disabled={formLoading} type="submit">
                {formLoading ? 'Saving...' : 'Save'}
              </Button>
              <ListButton resource={resourceName} variant="outline">
                Cancel
              </ListButton>
            </div>
          </form>
        )}
      </div>
    </EditView>
  );
}

// Show View Component
interface ShowPageViewProps {
  columns: ColumnInfo[];
  columnsLoading: boolean;
  recordId: string;
  resourceName: string;
}

function ShowPageView({
  resourceName,
  recordId,
  columns,
  columnsLoading,
}: ShowPageViewProps) {
  const { query } = useShow({
    resource: resourceName,
    id: recordId,
  });

  const record = query?.data?.data as Record<string, unknown> | undefined;

  const displayColumns = useMemo(() => {
    return columns.filter((col) => col.column_name !== 'id');
  }, [columns]);

  return (
    <ShowView>
      <ShowViewHeader />
      <div className="rounded-md border p-6">
        {columnsLoading || query.isLoading || !record ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {displayColumns.map((column) => (
              <div
                className="flex justify-between border-b py-2"
                key={column.column_name}
              >
                <span className="font-medium text-muted-foreground">
                  {column.column_name}
                </span>
                <span>{formatCellValue(record[column.column_name])}</span>
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

// Helper functions
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

function getInputType(dataType: string): string {
  const type = dataType.toLowerCase();
  if (type.includes('int')) {
    return 'number';
  }
  if (
    type.includes('float') ||
    type.includes('decimal') ||
    type.includes('numeric')
  ) {
    return 'number';
  }
  if (type.includes('bool')) {
    return 'checkbox';
  }
  if (type.includes('date') || type.includes('timestamp')) {
    return 'datetime-local';
  }
  if (type.includes('text')) {
    return 'textarea';
  }
  return 'text';
}

export default DynamicAdminPage;
