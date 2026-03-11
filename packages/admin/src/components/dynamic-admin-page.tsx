'use client';

import { useForm, useList, useShow } from '@refinedev/core';
import { useEffect, useMemo, useState } from 'react';
import { DeleteButton } from '@/components/refine-ui/buttons/delete';
import { EditButton } from '@/components/refine-ui/buttons/edit';
import { ListButton } from '@/components/refine-ui/buttons/list';
import { ShowButton } from '@/components/refine-ui/buttons/show';
import {
  CreateView,
  CreateViewHeader,
} from '@/components/refine-ui/views/create-view';
import { AdminDashboard } from '@/components/refine-ui/views/dashboard-view';
import {
  EditView,
  EditViewHeader,
} from '@/components/refine-ui/views/edit-view';
import {
  ListView,
  ListViewHeader,
} from '@/components/refine-ui/views/list-view';
import {
  ShowView,
  ShowViewHeader,
} from '@/components/refine-ui/views/show-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

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
      <div className={cn('oa-:p-6', className)}>
        <AdminDashboard />
      </div>
    );
  }

  if (!resourceName) {
    return (
      <div className={cn('oa-:p-6', className)}>
        <div className="oa-:text-destructive">Invalid resource</div>
      </div>
    );
  }

  // Render the appropriate view
  return (
    <div className={cn('oa-:p-6', className)}>
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
  const { data: recordsData, isLoading: recordsLoading } = useList({
    resource: resourceName,
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const records = recordsData?.data || [];
  const isLoading = recordsLoading || columnsLoading;

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
              <Skeleton className="oa-:h-4 oa-:w-full" />
            </TableCell>
          ))}
          <TableCell>
            <Skeleton className="oa-:h-8 oa-:w-20" />
          </TableCell>
        </TableRow>
      );
    }

    if (columnsError) {
      return (
        <TableRow>
          <TableCell
            className="oa-:h-24 oa-:text-center oa-:text-destructive"
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
            className="oa-:h-24 oa-:text-center"
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
            <div className="oa-:flex oa-:items-center oa-:gap-2">
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
      <div className="oa-:rounded-md oa-:border">
        <Table>
          <TableHeader>
            <TableRow>
              {displayColumns.map((column) => (
                <TableHead key={column.column_name}>
                  {column.column_name}
                </TableHead>
              ))}
              <TableHead className="oa-:w-[150px]">Actions</TableHead>
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
      <div className="oa-:rounded-md oa-:border oa-:p-6">
        {columnsLoading ? (
          <div className="oa-:space-y-4">
            <Skeleton className="oa-:h-10 oa-:w-full" />
            <Skeleton className="oa-:h-10 oa-:w-full" />
            <Skeleton className="oa-:h-10 oa-:w-full" />
          </div>
        ) : (
          <form className="oa-:space-y-4" onSubmit={handleSubmit}>
            {formColumns.map((column) => (
              <div className="oa-:space-y-2" key={column.column_name}>
                <Label htmlFor={column.column_name}>
                  {column.column_name}
                  {!column.is_nullable && (
                    <span className="oa-:text-destructive">*</span>
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
            <div className="oa-:flex oa-:gap-2">
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
  const { queryResult, formLoading, onFinish } = useForm({
    resource: resourceName,
    action: 'edit',
    id: recordId,
  });

  const record = queryResult?.data?.data as Record<string, unknown> | undefined;

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
      <div className="oa-:rounded-md oa-:border oa-:p-6">
        {columnsLoading || !record ? (
          <div className="oa-:space-y-4">
            <Skeleton className="oa-:h-10 oa-:w-full" />
            <Skeleton className="oa-:h-10 oa-:w-full" />
            <Skeleton className="oa-:h-10 oa-:w-full" />
          </div>
        ) : (
          <form className="oa-:space-y-4" onSubmit={handleSubmit}>
            {formColumns.map((column) => (
              <div className="oa-:space-y-2" key={column.column_name}>
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
            <div className="oa-:flex oa-:gap-2">
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
  const { queryResult } = useShow({
    resource: resourceName,
    id: recordId,
  });

  const record = queryResult?.data?.data as Record<string, unknown> | undefined;

  const displayColumns = useMemo(() => {
    return columns.filter((col) => col.column_name !== 'id');
  }, [columns]);

  return (
    <ShowView>
      <ShowViewHeader />
      <div className="oa-:rounded-md oa-:border oa-:p-6">
        {columnsLoading || queryResult.isLoading || !record ? (
          <div className="oa-:space-y-4">
            <Skeleton className="oa-:h-6 oa-:w-full" />
            <Skeleton className="oa-:h-6 oa-:w-full" />
            <Skeleton className="oa-:h-6 oa-:w-full" />
          </div>
        ) : (
          <div className="oa-:space-y-4">
            {displayColumns.map((column) => (
              <div
                className="oa-:flex oa-:justify-between oa-:border-b oa-:py-2"
                key={column.column_name}
              >
                <span className="oa-:font-medium oa-:text-muted-foreground">
                  {column.column_name}
                </span>
                <span>{formatCellValue(record[column.column_name])}</span>
              </div>
            ))}
            <div className="oa-:flex oa-:gap-2 oa-:pt-4">
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
