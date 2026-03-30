'use client';

import { AuthProvider } from '@/context/auth-context';
import { AdminContextProvider } from '@/hooks';
import { ResourcesProvider } from '@/hooks/use-resources';
import type { AdminSchema, ResolvedAdminSchema } from '@/lib/schema-types';
import type { AdminViews } from '@/lib/view-types';
import type { AuthClient } from '@/types';
import { Layout } from '@/ui/layout/layout';

export interface AdminProviderProps {
  authClient?: AuthClient;
  children: React.ReactNode;
  schema: ResolvedAdminSchema;
  views?: AdminViews<AdminSchema>;
}

export function AdminProvider({
  children,
  schema,
  views,
  authClient,
}: AdminProviderProps) {
  return (
    <AuthProvider authClient={authClient} skipSessionFetch>
      <AdminContextProvider>
        <ResourcesProvider schema={schema} views={views}>
          <Layout>{children}</Layout>
        </ResourcesProvider>
      </AdminContextProvider>
    </AuthProvider>
  );
}
