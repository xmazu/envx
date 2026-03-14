/**
 * Client-side exports for @openenvx/admin
 *
 * This package provides utilities to set up Refine with PostgREST.
 *
 * For UI components, use Refine's shadcn/ui registry:
 * npx shadcn@latest add https://ui.refine.dev/r/views.json
 * npx shadcn@latest add https://ui.refine.dev/r/data-table.json
 * npx shadcn@latest add https://ui.refine.dev/r/layout/layout-01.json
 *
 * @see https://refine.dev/core/docs/ui-integrations/shadcn/introduction/
 */

export type { AdminResource, AdminResourcesConfig } from './resources';
export { createAdminResources } from './resources';
