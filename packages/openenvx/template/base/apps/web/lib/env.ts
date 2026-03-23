import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z
      .string()
      .url('NEXT_PUBLIC_APP_URL must be a valid URL')
      .default('http://localhost:3000'),
  },
  runtimeEnv: process.env,
});

export const isDevelopment = () => env.NODE_ENV === 'development';
export const isProduction = () => env.NODE_ENV === 'production';
export const isTest = () => env.NODE_ENV === 'test';
