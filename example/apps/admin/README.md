# Admin Panel

This is an admin panel powered by [Refine](https://refine.dev/) and built with Next.js App Router.

## Features

- **Next.js App Router**: Modern React framework with App Router
- **Refine.dev**: Headless React framework for building admin panels
- **shadcn/ui**: Beautiful UI components built on Radix UI
- **Dynamic Resources**: Auto-generate CRUD pages from configuration
- **Simple REST**: Connects to your dashboard API

## Getting Started

1. Start the dashboard API (port 3000):
   ```bash
   cd apps/dashboard
   bun dev
   ```

2. Start the admin panel (port 3001):
   ```bash
   cd apps/admin
   bun dev
   ```

3. Open http://localhost:3001 in your browser

## Generating Resources from Drizzle Schema

Instead of manually defining resources, you can auto-generate them from your Drizzle database schema:

```bash
cd apps/admin
bun run generate:resources
```

This will:
1. Scan your Drizzle schema file
2. Extract all table definitions
3. Generate resource configuration with appropriate icons
4. Create CRUD routes automatically

You can then customize the generated `lib/resource-config.ts` file to:
- Add custom icons for your tables
- Hide certain resources from the sidebar
- Reorder resources
- Add custom meta properties

## Project Structure

```
app/
├── page.tsx                 # Dashboard home
├── layout.tsx              # Root layout with Refine provider
├── [resource]/
│   ├── page.tsx           # List view (auto-generated)
│   ├── create/
│   │   └── page.tsx       # Create form
│   └── [id]/
│       ├── edit/
│       │   └── page.tsx   # Edit form
│       └── show/
│           └── page.tsx   # Detail view
components/
├── refine-provider.tsx    # Refine configuration
└── admin-layout.tsx       # Sidebar layout
lib/
└── resource-config.ts     # Resource definitions
```

## Adding Custom Resources

Edit `lib/resource-config.ts`:

```typescript
export const resources: ResourceConfig[] = [
  {
    name: "my-resource",
    list: "/my-resource",
    create: "/my-resource/create",
    edit: "/my-resource/edit/:id",
    show: "/my-resource/show/:id",
    label: "My Resource",
    icon: MyIcon,
  },
];
```

## Authentication

The admin panel uses Better Auth from `@example/auth`. 
Super admin users are stored in a separate table (see `packages/auth` for details).

## Data Provider

Currently using Simple REST data provider connecting to:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

You can switch to a custom data provider by modifying `components/refine-provider.tsx`.

## Customizing UI

The admin panel uses components from `@example/ui`. You can:

1. Add more shadcn components to the shared UI package
2. Import Refine's shadcn registry components
3. Create custom components in `components/`

## Learn More

- [Refine Documentation](https://refine.dev/docs/)
- [Refine + Next.js](https://refine.dev/docs/routing/integrations/next-js/)
- [Refine + shadcn/ui](https://refine.dev/docs/ui-integrations/shadcn/introduction/)
