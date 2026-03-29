export type ViewMode =
  | 'dashboard'
  | 'list'
  | 'create'
  | 'edit'
  | 'show'
  | 'nested-list';

export interface NestedPathInfo {
  nestedResourceName: string;
  parentId: string;
}

export interface ParsedPath {
  nestedInfo: NestedPathInfo | null;
  recordId: string | null;
  resourceName: string | null;
  viewMode: ViewMode;
}

export function parsePath(path: string[]): ParsedPath {
  if (path.length === 0) {
    return {
      resourceName: null,
      viewMode: 'dashboard',
      recordId: null,
      nestedInfo: null,
    };
  }

  const resourceName = path[0];

  if (path.length === 1) {
    return { resourceName, viewMode: 'list', recordId: null, nestedInfo: null };
  }

  const action = path[1];

  if (action === 'create') {
    return {
      resourceName,
      viewMode: 'create',
      recordId: null,
      nestedInfo: null,
    };
  }

  if (action === 'edit' && path[2]) {
    return {
      resourceName,
      viewMode: 'edit',
      recordId: path[2],
      nestedInfo: null,
    };
  }

  if ((action === 'show' || action === 'view') && path[2]) {
    return {
      resourceName,
      viewMode: 'show',
      recordId: path[2],
      nestedInfo: null,
    };
  }

  // Nested resource: /events/:id/media
  if (
    path.length >= 3 &&
    path[2] &&
    !['create', 'edit', 'show', 'view'].includes(path[2])
  ) {
    return {
      resourceName,
      viewMode: 'nested-list',
      recordId: null,
      nestedInfo: {
        parentId: path[1],
        nestedResourceName: path[2],
      },
    };
  }

  if (path[1] && !['create', 'edit', 'show', 'view'].includes(path[1])) {
    return {
      resourceName,
      viewMode: 'show',
      recordId: path[1],
      nestedInfo: null,
    };
  }

  return { resourceName, viewMode: 'list', recordId: null, nestedInfo: null };
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return JSON.stringify(value).slice(0, 50);
  }
  return String(value).slice(0, 50);
}
