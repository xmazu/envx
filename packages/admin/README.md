# @openenvx/admin

Zero-config admin panel powered by PostgREST, Refine and shadcn/ui.

## Features

- **Zero Configuration**: Works out of the box with any PostgreSQL database
- **PostgREST Powered**: Automatic REST API from your database schema
- **Full CRUD**: List, create, edit, and delete operations for all tables
- **Type Safe**: Full TypeScript support
- **Customizable**: Override any part of the UI or behavior
- **Modern Stack**: Built on PostgREST, Refine, shadcn/ui, and Tailwind CSS

## Installation

```bash
# Install @openenvx/admin and required peer dependencies
npm install @openenvx/admin @refinedev/core @refinedev/react-table @tanstack/react-table

# Install Refine's shadcn/ui components
npx shadcn@latest add https://ui.refine.dev/r/views.json
npx shadcn@latest add https://ui.refine.dev/r/data-table.json
npx shadcn@latest add https://ui.refine.dev/r/layout/layout-01.json
npx shadcn@latest add https://ui.refine.dev/r/buttons.json
```

## Quick Start

### 1. Start PostgREST

Create a `docker-compose.yml`:

```yaml
version: "3.8"

services:
  postgrest:
    image: postgrest/postgrest:v12.2.3
    ports:
      - "3001:3000"
    environment:
      PGRST_DB_URI: ${DATABASE_URL}
      PGRST_DB_SCHEMAS: "public"
      PGRST_DB_ANON_ROLE: "anon"
      PGRST_JWT_SECRET: ${JWT_SECRET}
```

Run:

```bash
docker-compose up postgrest
```

### 2. Set up Database Roles

Run the migration to create PostgREST roles:

```sql
-- Create roles for PostgREST
CREATE ROLE IF NOT EXISTS anon NOLOGIN;
CREATE ROLE IF NOT EXISTS authenticator NOLOGIN;
GRANT anon TO authenticator;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
```

### 3. Set up Refine with Admin Resources (Client)

```typescript
// app/admin/layout.tsx
'use client';

import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { Layout } from '@/components/refine-ui/layout/layout-01';
import { createAdminResources, createPostgRESTDataProvider } from '@openenvx/admin';

const POSTGREST_URL = process.env.NEXT_PUBLIC_POSTGREST_URL || 'http://localhost:3001';

// Create data provider
const dataProvider = createPostgRESTDataProvider({
  apiUrl: POSTGREST_URL,
  getToken: () => localStorage.getItem('token'),
});

// Fetch resources (async)
const resourcesPromise = createAdminResources({
  postgrestUrl: POSTGREST_URL,
  exclude: ['__drizzle_migrations'],
  resources: {
    users: {
      label: 'Team Members',
      meta: { icon: 'Users' }
    },
    posts: {
      label: 'Blog Posts',
      meta: { icon: 'FileText' }
    }
  }
});

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const resources = await resourcesPromise;

  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      resources={resources}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        useNewQueryKeys: true,
        projectId: 'my-admin',
      }}
    >
      <Layout>{children}</Layout>
    </Refine>
  );
}
```

## API Reference

### `createAdminResources(config)`

Generates Refine resource configurations from PostgREST-exposed tables.

```typescript
const resources = await createAdminResources({
  postgrestUrl: "http://localhost:3001",
  exclude: ["migrations"], // Tables to exclude
  defaultIcon: "FileText", // Default icon for resources
  resources: {
    // Custom resource config
    users: {
      label: "Team Members",
      meta: { icon: "Users" },
    },
  },
});
```

### `createPostgRESTDataProvider(config)`

Creates a Refine data provider that communicates with PostgREST.

```typescript
const dataProvider = createPostgRESTDataProvider({
  apiUrl: "http://localhost:3001",
  getToken: () => localStorage.getItem("token"),
  headers: { "X-Custom-Header": "value" },
});
```

### `createPostgRESTProxy(config)`

Creates a Next.js API route handler that proxies requests to PostgREST.

```typescript
// app/api/admin/[...path]/route.ts
import { createPostgRESTProxy } from "@openenvx/admin/server";

const proxy = createPostgRESTProxy({
  postgrestUrl: process.env.POSTGREST_URL!,
  getToken: (request) =>
    request.headers.get("authorization")?.replace("Bearer ", "") || null,
});

export const { GET, POST, PUT, PATCH, DELETE } = proxy;
```

## Super Admin Setup

To restrict admin access to super admins only:

1. Create the super_admin table (included in migrations)
2. Add users to the super_admin table
3. Configure PostgREST with row-level security:

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy that only allows super admins full access
CREATE POLICY admin_all ON users
  USING (is_super_admin(current_user_id()));
```

## License

MIT
