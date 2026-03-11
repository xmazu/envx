/**
 * Core types for @openenvx/admin
 */

// Minimal Component type to avoid React import issues in core types
export type ComponentType<P = object> = (props: P) => unknown;

export interface ColumnSchema {
  defaultValue?: unknown;
  enumValues?: string[];
  isForeignKey: boolean;
  isPrimary: boolean;
  maxLength?: number;
  name: string;
  nullable: boolean;
  referencedTable?: string;
  type: string;
}

export interface TableSchema {
  columns: ColumnSchema[];
  name: string;
  primaryKey: string;
}

export interface AdminSchema {
  tables: TableSchema[];
  version: string;
}

export interface ListQuery {
  filters?: Record<string, string>;
  limit?: number;
  order?: 'asc' | 'desc';
  page?: number;
  search?: string;
  sort?: string;
}

export interface ListResult<T> {
  data: T[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export type PermissionCheck = (
  user: unknown,
  action: 'read' | 'create' | 'update' | 'delete',
  table: string
) => Promise<boolean> | boolean;

export interface AdminRouterConfig {
  databaseUrl: string;
  permissions?: PermissionCheck;
  schema: string;
}

export interface FieldConfig {
  component?: ComponentType<FieldComponentProps>;
  description?: string;
  hidden?: boolean;
  label?: string;
  placeholder?: string;
  validate?: (value: unknown) => boolean | string;
}

export interface FieldComponentProps {
  disabled?: boolean;
  error?: string;
  name: string;
  onChange: (value: unknown) => void;
  schema: ColumnSchema;
  value: unknown;
}

export interface TableConfig {
  form?: {
    layout?: FormLayout[];
    fieldOverrides?: Record<string, FieldConfig>;
  };
  hidden?: boolean;
  icon?: string;
  label?: string;
  list?: {
    fields?: string[];
    searchable?: string[];
    defaultSort?: { field: string; direction: 'asc' | 'desc' };
  };
}

export interface FormLayout {
  fields: string[];
  section: string;
}

export interface AdminConfig {
  appName?: string;
  customPages?: CustomPage[];
  tables?: Record<string, TableConfig>;
  theme?: 'light' | 'dark' | 'system';
}

export interface CustomPage {
  component: ComponentType;
  label: string;
  path: string;
}
