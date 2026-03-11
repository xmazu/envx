'use client';

import { Database, LayoutDashboard, Rows3, Table2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
      <CardHeader className="oa-:flex oa-:flex-row oa-:items-center oa-:justify-between oa-:space-y-0 oa-:pb-2">
        <CardTitle className="oa-:font-medium oa-:text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="oa-:h-8 oa-:w-20" />
        ) : (
          <>
            <div className="oa-:font-bold oa-:text-2xl">{value}</div>
            {description && (
              <p className="oa-:text-muted-foreground oa-:text-xs">
                {description}
              </p>
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
        <div className="oa-:space-y-2">
          <Skeleton className="oa-:h-4 oa-:w-full" />
          <Skeleton className="oa-:h-4 oa-:w-full" />
          <Skeleton className="oa-:h-4 oa-:w-full" />
        </div>
      );
    }

    if (error) {
      return <p className="oa-:text-destructive oa-:text-sm">Error: {error}</p>;
    }

    if (tables.length === 0) {
      return (
        <p className="oa-:text-muted-foreground oa-:text-sm">
          No tables found in the database.
        </p>
      );
    }

    return (
      <div className="oa-:grid oa-:gap-2 oa-:sm:grid-cols-2 oa-:lg:grid-cols-3">
        {tables.map((table) => (
          <a
            className="oa-:flex oa-:items-center oa-:gap-2 oa-:rounded-md oa-:border oa-:p-3 oa-:transition-colors hover:oa-:bg-muted"
            href={`/${table.table_name}`}
            key={table.table_name}
          >
            <Table2 className="oa-:h-4 oa-:w-4 oa-:text-muted-foreground" />
            <span className="oa-:font-medium">{table.table_name}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('oa-:flex oa-:flex-col oa-:gap-6', className)}>
      <div className="oa-:flex oa-:items-center oa-:gap-2">
        <LayoutDashboard className="oa-:h-6 oa-:w-6" />
        <h1 className="oa-:font-bold oa-:text-2xl">Dashboard</h1>
      </div>

      <div className="oa-:grid oa-:gap-4 oa-:md:grid-cols-2 oa-:lg:grid-cols-3">
        <DashboardCard
          description="Database tables available"
          icon={
            <Database className="oa-:h-4 oa-:w-4 oa-:text-muted-foreground" />
          }
          loading={loading}
          title="Total Tables"
          value={tableCount}
        />
        <DashboardCard
          description="Resources in admin panel"
          icon={
            <Table2 className="oa-:h-4 oa-:-w-4 oa-:text-muted-foreground" />
          }
          loading={loading}
          title="Active Resources"
          value={tableCount}
        />
        <DashboardCard
          description="All systems operational"
          icon={<Rows3 className="oa-:h-4 oa-:w-4 oa-:text-muted-foreground" />}
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
