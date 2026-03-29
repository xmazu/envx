import type React from 'react';
import { AdminProvider } from '../components/admin-provider';
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

  try {
    const tables = await fetchAllSchemas();
    introspection = {
      tables,
      version: '1.0.0',
    };
  } catch (error) {
    console.warn('Failed to fetch database introspection:', error);
  }

  return (
    <AdminProvider
      authClient={authClient}
      introspection={introspection}
      resources={resources}
    >
      {children}
    </AdminProvider>
  );
}
