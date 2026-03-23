'use client';

import { Database, LayoutDashboard, Rows3, Table2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/shadcn/card';
import { Skeleton } from '@/ui/shadcn/skeleton';

interface DashboardCardProps {
  description?: string;
  icon: React.ReactNode;
  loading?: boolean;
  title: string;
  value: string | number;
}

function DashboardCard({
  title,
  value,
  description,
  icon,
  loading,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="font-bold text-2xl">{value}</div>
            {description && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface AdminDashboardProps {
  className?: string;
}

interface TableInfo {
  table_name: string;
}

export function AdminDashboard({ className }: AdminDashboardProps) {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await fetch('/api/admin/introspection/tables');
        if (!response.ok) {
          throw new Error('Failed to fetch tables');
        }
        const data = await response.json();
        setTables(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  const tableCount = tables.length;

  function renderTablesContent() {
    if (loading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return <p className="text-destructive text-sm">Error: {error}</p>;
    }

    if (tables.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          No tables found in the database.
        </p>
      );
    }

    return (
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <a
            className="flex items-center gap-2 rounded-md border p-3 transition-colors hover:bg-muted"
            href={`/${table.table_name}`}
            key={table.table_name}
          >
            <Table2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{table.table_name}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6" />
        <h1 className="font-bold text-2xl">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          description="Database tables available"
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          loading={loading}
          title="Total Tables"
          value={tableCount}
        />
        <DashboardCard
          description="Resources in admin panel"
          icon={<Table2 className="h-4 -w-4 text-muted-foreground" />}
          loading={loading}
          title="Active Resources"
          value={tableCount}
        />
        <DashboardCard
          description="All systems operational"
          icon={<Rows3 className="h-4 w-4 text-muted-foreground" />}
          title="System Status"
          value="Active"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Tables</CardTitle>
        </CardHeader>
        <CardContent>{renderTablesContent()}</CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
