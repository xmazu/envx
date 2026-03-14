import { defineConfig } from 'rolldown';
import { copy } from './scripts/copy-plugin.js';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    banner: '#!/usr/bin/env node',
  },
  external: [
    '@clack/prompts',
    'commander',
    'execa',
    'fs-extra',
    'globby',
    'handlebars',
    'picocolors',
  ],
  platform: 'node',
  plugins: [
    copy({
      from: './template',
      to: './dist/template',
    }),
  ],
});
