import { createAuth } from '@example/auth';
import { db } from './db';
import { env } from './env';

export const auth = createAuth({
  database: db,
  secret: env.BETTER_AUTH_SECRET,
  url: env.BETTER_AUTH_URL,
});
