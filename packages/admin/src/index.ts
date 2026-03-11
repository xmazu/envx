/**
 * @openenvx/admin
 *
 * Zero-config admin panel powered by PostgREST, Refine and shadcn/ui.
 *
 * @example
 * Server setup:
 * ```typescript
 * import { createPostgRESTDataProvider } from '@openenvx/admin/server';
 *
 * export const dataProvider = createPostgRESTDataProvider({
 *   apiUrl: 'http://localhost:3001',
 *   getToken: () => localStorage.getItem('token'),
 * });
 * ```
 *
 * Client setup:
 * ```typescript
 * import { createAdminResources } from '@openenvx/admin';
 *
 * const resources = await createAdminResources({
 *   postgrestUrl: 'http://localhost:3001'
 * });
 * ```
 */

export type { AdminResource, AdminResourcesConfig } from './client/resources';
// Client exports
export { createAdminResources } from './client/resources';
export type { PostgRESTDataProviderConfig } from './server/data-provider';
// Server exports
export { createPostgRESTDataProvider } from './server/data-provider';
