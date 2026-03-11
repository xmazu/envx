'use client';

import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import dataProvider from '@refinedev/simple-rest';
import { AdminLayout } from '@/components/admin-layout';
import { resources } from '@/lib/resource-config';

const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || '/api/admin';

export function RefineProvider({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      dataProvider={dataProvider(API_URL)}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        useNewQueryKeys: true,
        projectId: 'admin-panel',
      }}
      resources={resources}
      routerProvider={routerProvider}
    >
      <AdminLayout>{children}</AdminLayout>
    </Refine>
  );
}
