'use client';

import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { LayoutDashboard } from 'lucide-react';
import { useMemo } from 'react';
import { Layout } from '@/components/refine-ui/layout/layout';
import { resources } from '@/lib/resource-config';
import { createPostgRESTDataProvider } from '@/server/data-provider';

const POSTGREST_URL =
  process.env.NEXT_PUBLIC_POSTGREST_URL || 'http://localhost:3001';

export function RefineProvider({ children }: { children: React.ReactNode }) {
  const dataProvider = useMemo(
    () =>
      createPostgRESTDataProvider({
        apiUrl: POSTGREST_URL,
      }),
    []
  );

  return (
    <Refine
      dataProvider={dataProvider as any}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        projectId: 'admin-panel',
        title: {
          icon: <LayoutDashboard className="h-6 w-6" />,
          text: 'Admin Panel',
        },
      }}
      resources={resources}
      routerProvider={routerProvider}
    >
      <Layout>{children}</Layout>
    </Refine>
  );
}
