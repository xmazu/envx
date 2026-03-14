/**
 * PostgREST-based admin resources
 */

import type { ResourceProps } from '@refinedev/core';

export interface AdminResource extends ResourceProps {
  hidden?: boolean;
  icon?: string;
  label?: string;
  meta?: {
    label?: string;
    icon?: string;
    [key: string]: unknown;
  };
}

export interface AdminResourcesConfig {
  /** Default icon for resources */
  defaultIcon?: string;
  /** Tables to exclude from the admin panel */
  exclude?: string[];
  /** PostgREST API URL */
  postgrestUrl: string;
  /** Custom resource configurations */
  resources?: Record<string, Partial<AdminResource>>;
}

interface PostgRESTTable {
  table_name: string;
}

/**
 * Fetch tables from PostgreSQL information schema via PostgREST
 */
async function fetchTables(postgrestUrl: string): Promise<string[]> {
  const response = await fetch(
    `${postgrestUrl}/information_schema.tables?select=table_name&table_schema=eq.public&table_type=eq.BASE TABLE`,
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch tables: ${response.statusText}`);
  }

  const tables: PostgRESTTable[] = await response.json();
  return tables.map((t) => t.table_name);
}

/**
 * Generate Refine resources from PostgREST-exposed tables
 *
 * @example
 * ```typescript
 * const resources = await createAdminResources({
 *   postgrestUrl: 'http://localhost:3001',
 *   exclude: ['migrations'],
 *   resources: {
 *     users: {
 *       label: 'Team Members',
 *       meta: { icon: 'Users' }
 *     }
 *   }
 * });
 * ```
 */
export async function createAdminResources(
  config: AdminResourcesConfig
): Promise<AdminResource[]> {
  const {
    postgrestUrl,
    exclude = [],
    resources = {},
    defaultIcon = 'FileText',
  } = config;

  const tableNames = await fetchTables(postgrestUrl);
  const adminResources: AdminResource[] = [];

  for (const tableName of tableNames) {
    // Skip excluded tables
    if (exclude.includes(tableName)) {
      continue;
    }

    // Get custom config for this resource
    const customConfig = resources[tableName] || {};

    // Skip if explicitly hidden
    if (customConfig.hidden) {
      continue;
    }

    const resource: AdminResource = {
      name: tableName,
      list: `/${tableName}`,
      create: `/${tableName}/create`,
      edit: `/${tableName}/edit/:id`,
      show: `/${tableName}/show/:id`,
      label: customConfig.label || capitalize(tableName),
      icon: customConfig.icon || defaultIcon,
      meta: {
        label: customConfig.label || capitalize(tableName),
        icon: customConfig.icon || defaultIcon,
        ...customConfig.meta,
      },
      ...customConfig,
    };

    adminResources.push(resource);
  }

  return adminResources;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
