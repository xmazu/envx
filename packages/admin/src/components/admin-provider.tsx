'use client';

import { useEffect } from 'react';
import { AuthProvider } from '@/context/auth-context';
import { AdminContextProvider } from '@/hooks';
import { ResourcesProvider } from '@/hooks/use-resources';
import type { AuthClient } from '@/types';
import type { IntrospectionData, ResourceItem } from '@/types/resources';
import { Layout } from '@/ui/layout/layout';

export interface AdminProviderProps {
  authClient?: AuthClient;
  children: React.ReactNode;
  introspection?: IntrospectionData;
  resources: ResourceItem[];
}

function validateResource(
  resource: ResourceItem,
  tableNames: Set<string>,
  tables: IntrospectionData['tables']
): void {
  if (!tableNames.has(resource.name)) {
    console.warn(
      `[Admin] Resource "${resource.name}" is defined but table "${resource.name}" was not found in the database introspection.`
    );
  }

  if (!resource.nested) {
    return;
  }

  for (const [nestedName, nestedConfig] of Object.entries(resource.nested)) {
    const nestedTable = tables.find((t) => t.name === nestedName);
    if (!nestedTable) {
      console.warn(
        `[Admin] Nested resource "${nestedName}" for "${resource.name}" is defined but table "${nestedName}" was not found in the database introspection.`
      );
      continue;
    }

    if (nestedConfig.parentField) {
      const hasField = nestedTable.columns.some(
        (c) => c.name === nestedConfig.parentField
      );
      if (!hasField) {
        console.warn(
          `[Admin] Nested resource "${nestedName}" specifies parentField "${nestedConfig.parentField}" but column not found in table "${nestedName}".`
        );
      }
    }
  }
}

function validateResources(
  resources: ResourceItem[],
  introspection?: IntrospectionData
): void {
  if (!introspection) {
    return;
  }

  const tableNames = new Set(introspection.tables.map((t) => t.name));
  for (const resource of resources) {
    validateResource(resource, tableNames, introspection.tables);
  }
}

export const AdminProvider = ({
  children,
  resources,
  authClient,
  introspection,
}: AdminProviderProps) => {
  useEffect(() => {
    validateResources(resources, introspection);
  }, [resources, introspection]);

  return (
    <AuthProvider authClient={authClient} skipSessionFetch>
      <AdminContextProvider>
        <ResourcesProvider resources={resources}>
          <Layout>{children}</Layout>
        </ResourcesProvider>
      </AdminContextProvider>
    </AuthProvider>
  );
};
