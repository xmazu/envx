import { unstable_cache } from 'next/cache';
import type { ResourceItem } from '@/types/resources';
import { fetchTables } from './introspection';

const LABEL_REGEX_UNDERSCORE = /_/g;
const LABEL_REGEX_CAMEL = /([A-Z])/g;
const LABEL_REGEX_LEADING_SPACE = /^\s+/;
const LABEL_REGEX_EXTRA_SPACES = /\s+/g;

function formatLabel(name: string): string {
  return name
    .replace(LABEL_REGEX_UNDERSCORE, ' ')
    .replace(LABEL_REGEX_CAMEL, ' $1')
    .replace(LABEL_REGEX_LEADING_SPACE, '')
    .replace(LABEL_REGEX_EXTRA_SPACES, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export const getResources = unstable_cache(
  async (): Promise<ResourceItem[]> => {
    const tableNames = await fetchTables();

    return tableNames.map((name) => ({
      name,
      label: formatLabel(name),
      list: `/${name}`,
      create: `/${name}/create`,
      edit: `/${name}/:id/edit`,
      show: `/${name}/:id`,
      meta: {
        label: formatLabel(name),
      },
    }));
  },
  ['admin-resources'],
  { revalidate: 60, tags: ['admin-schema'] }
);
