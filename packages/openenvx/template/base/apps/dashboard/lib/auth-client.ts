'use client';

import { createAuthClient } from 'better-auth/react';

// Client-side auth uses the current origin by default
// The base URL is determined by the server-side auth configuration
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});

export const { signIn, signUp, signOut, useSession } = authClient;
