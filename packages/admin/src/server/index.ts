/**
 * Server-side exports for @openenvx/admin
 */

export type { PostgRESTDataProviderConfig } from './data-provider';
export { createPostgRESTDataProvider } from './data-provider';
export type { PostgRESTProxyConfig, RouteContext } from './router';
export { createPostgRESTProxy } from './router';
