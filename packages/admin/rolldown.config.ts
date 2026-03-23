import { defineConfig } from 'rolldown';

const externalDeps = [
  'react',
  'react-dom',
  'next',
  'drizzle-orm',
  '@tanstack/react-table',
  'refine-sqlx',
  '@events/ui',
  '@swc/helpers',
  'lucide-react',
  'radix-ui',
  '@radix-ui',
  'use-sync-external-store',
  'cmdk',
  'date-fns',
  'react-day-picker',
  'tailwind-merge',
  'class-variance-authority',
  'clsx',
  'postgres',
];

const external = (id: string) => {
  // Externalize all node_modules
  if (id.includes('node_modules')) {
    return true;
  }
  // Externalize by package name
  return externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`));
};

export default defineConfig([
  // Main entry
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      entryFileNames: '[name].js',
    },
    external,
    resolve: {
      conditionNames: ['import', 'module', 'default'],
    },
  },
  // Server entry
  {
    input: 'src/server/index.ts',
    output: {
      dir: 'dist/server',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      entryFileNames: '[name].js',
    },
    external,
    resolve: {
      conditionNames: ['import', 'module', 'default'],
    },
  },
  // Client entry
  {
    input: 'src/client/index.ts',
    output: {
      dir: 'dist/client',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      entryFileNames: '[name].js',
    },
    external,
    resolve: {
      conditionNames: ['import', 'module', 'default'],
    },
  },
]);
