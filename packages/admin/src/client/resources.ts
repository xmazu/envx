import type { ReactNode } from 'react';

export interface ResourceRouteComposition {
  path?: string;
}

export interface ResourceMeta {
  icon?: ReactNode;
  label?: string;
  [key: string]: unknown;
}

export interface IResourceComponents {
  clone?: ResourceRouteComposition | string;
  create?: ResourceRouteComposition | string;
  edit?: ResourceRouteComposition | string;
  list?: ResourceRouteComposition | string;
  show?: ResourceRouteComposition | string;
}

export interface ResourceProps extends IResourceComponents {
  icon?: ReactNode;
  identifier?: string;
  label?: string;
  meta?: ResourceMeta;
  name: string;
  route?: string;
}

export interface AdminResource extends ResourceProps {
  hidden?: boolean;
}

export interface AdminResourcesConfig {
  /** Base path for admin routes (e.g., '/admin' -> routes become '/admin/users') */
  basePath?: string;
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
 * Generate resources from PostgREST-exposed tables
 *
 * @example
 * ```typescript
 * import { Users } from 'lucide-react';
 *
 * const resources = await createAdminResources({
 *   postgrestUrl: 'http://localhost:3001',
 *   exclude: ['migrations'],
 *   resources: {
 *     users: {
 *       label: 'Team Members',
 *       meta: { icon: <Users className="h-4 w-4" /> }
 *     }
 *   }
 * });
 * ```
 */
export async function createAdminResources(
  config: AdminResourcesConfig
): Promise<AdminResource[]> {
  const { basePath = '', postgrestUrl, exclude = [], resources = {} } = config;

  const tableNames = await fetchTables(postgrestUrl);
  const adminResources: AdminResource[] = [];

  const normalizedBasePath = basePath
    ? `${basePath.startsWith('/') ? '' : '/'}${basePath.replace(/\/$/, '')}`
    : '';

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
      list: `${normalizedBasePath}/${tableName}`,
      create: `${normalizedBasePath}/${tableName}/create`,
      edit: `${normalizedBasePath}/${tableName}/edit/:id`,
      show: `${normalizedBasePath}/${tableName}/show/:id`,
      label: customConfig.label || capitalize(tableName),
      meta: {
        label: customConfig.label || capitalize(tableName),
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
