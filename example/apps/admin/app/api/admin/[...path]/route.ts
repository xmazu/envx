import { createAdminRouter } from '@openenvx/admin/server';

const handler = createAdminRouter({
  schema: '../../db/src/schema.ts',
  databaseUrl: process.env.DATABASE_URL!,
});

export const { GET, POST, PUT, DELETE } = handler;
