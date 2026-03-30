import type { ResolvedResource } from '@/lib/schema-types';

export type ResourcesConfig = Record<string, ResolvedResource>;

export interface ResourceItem {
  config?: ResolvedResource;
  create?: string;
  displayField?: string;
  edit?: string;
  icon?: string;
  label: string;
  list: string;
  meta?: {
    label?: string;
    icon?: string;
    [key: string]: unknown;
  };
  name: string;
  nested?: Record<string, NestedResourceItem>;
  show?: string;
}

export interface NestedResourceItem {
  create?: string;
  edit?: string;
  icon?: string;
  label: string;
  list: string;
  meta?: {
    label?: string;
    icon?: string;
    [key: string]: unknown;
  };
  name: string;
  parentField?: string;
  show?: string;
}

export interface BreadcrumbItem {
  href?: string;
  icon?: string;
  label: string;
}

export interface IntrospectedColumn {
  dataType: string;
  defaultValue: string | null;
  isNullable: boolean;
  isPrimaryKey: boolean;
  name: string;
}

export interface ForeignKeyInfo {
  column: string;
  foreignColumn: string;
  foreignTable: string;
}

export interface IntrospectedTable {
  columns: IntrospectedColumn[];
  foreignKeys: ForeignKeyInfo[];
  name: string;
  primaryKey: string | null;
}

export interface IntrospectionData {
  tables: IntrospectedTable[];
  version: string;
}
