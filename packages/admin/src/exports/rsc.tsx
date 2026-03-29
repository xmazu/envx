import type React from 'react';
import { AdminProvider } from '../components/admin-provider';
import { enhanceResourcesWithIntrospection } from '../lib/enhance-resource-config';
import { fetchAllSchemas } from '../server/introspection';
import type { AuthClient } from '../types';
import type { IntrospectionData, ResourceItem } from '../types/resources';
import type { Admin } from './server';

export interface AdminServerProviderProps {
  admin: Admin;
  authClient?: AuthClient;
  children: React.ReactNode;
  resources: ResourceItem[];
}

export async function AdminServerProvider({
  admin: _admin,
  authClient,
  children,
  resources,
}: AdminServerProviderProps) {
  let introspection: IntrospectionData | undefined;
  let enhancedResources = resources;

  try {
    const tables = await fetchAllSchemas();
    introspection = {
      tables,
      version: '1.0.0',
    };
    enhancedResources = enhanceResourcesWithIntrospection(resources, tables);
  } catch (error) {
    console.warn('Failed to fetch database introspection:', error);
  }

  return (
    <AdminProvider
      authClient={authClient}
      introspection={introspection}
      resources={enhancedResources}
    >
      {children}
    </AdminProvider>
  );
}
