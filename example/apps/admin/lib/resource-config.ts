import { createAdminResources } from '@openenvx/admin';

import * as schema from '@example/db/schema';

export const resources = createAdminResources({
  schema,
  exclude: ['__drizzle_migrations'],
  defaultIcon: 'FileText',
});

export function getResourceByName(name: string) {
  return resources.find((r) => r.name === name);
}

export function getVisibleResources() {
  return resources.filter((r) => !r.hidden);
}
