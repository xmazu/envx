import type { Database } from '@{{projectName}}/db';
import { betterAuth } from 'better-auth';

interface AuthConfig {
  database: Database;
  secret: string;
  url: string;
}

export function createAuth({ database, secret, url }: AuthConfig) {
  return betterAuth({
    database: {
      provider: 'pg',
      connectionString: database,
    },
    secret,
    baseURL: url,
    socialProviders: {},
  });
}

export type Auth = ReturnType<typeof createAuth>;
