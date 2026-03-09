import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
// biome-ignore lint/performance/noNamespaceImport: Schema is not a namespace
import * as schema from './schema';

export type Database = NeonHttpDatabase<typeof schema>;

export function createDbClient(databaseUrl: string): Database {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}
