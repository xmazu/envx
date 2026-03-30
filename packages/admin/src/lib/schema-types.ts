import type {
  AccessConfig,
  BulkActionConfig,
  FieldConfig,
  ListFilter,
  ResourceHooks,
} from './resource-types';

export type SchemaFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'json'
  | 'reference'
  | 'url'
  | 'color'
  | 'phone'
  | 'slug'
  | 'rich-text'
  | 'array'
  | 'uuid'
  | 'computed';

export interface BaseSchemaField {
  defaultValue?: unknown;
  description?: string;
  hidden?: boolean;
  label?: string;
  name: string;
  readOnly?: boolean;
  required?: boolean;
  type: SchemaFieldType;
}

export interface ReferenceSchemaConfig {
  displayField?: string;
  table: string;
  valueField?: string;
}

export interface ReferenceSchemaField extends BaseSchemaField {
  reference: ReferenceSchemaConfig;
  type: 'reference';
}

export interface SelectSchemaField extends BaseSchemaField {
  options: Array<{ label: string; value: string | number }> | string[];
  type: 'select' | 'multiselect';
}

export interface ComputedSchemaField extends BaseSchemaField {
  async?: boolean;
  compute: (
    record: Record<string, unknown>,
    context?: { db?: unknown }
  ) => unknown | Promise<unknown>;
  deps: string[];
  type: 'computed';
}

export interface StandardSchemaField extends BaseSchemaField {
  type: Exclude<
    SchemaFieldType,
    'reference' | 'select' | 'multiselect' | 'computed'
  >;
}

export type SchemaField =
  | StandardSchemaField
  | ReferenceSchemaField
  | SelectSchemaField
  | ComputedSchemaField;

export interface SchemaListConfig {
  actions?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    show?: boolean;
    clone?: boolean;
  };
  bulkActions?: BulkActionConfig[];
  columns?: string[];
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
  filters?: ListFilter[];
  pageSizeOptions?: number[];
  perPage?: number;
  searchable?: string[];
}

export interface SchemaFormConfig {
  columns?: number;
  groups?: Array<{
    type: 'tab' | 'group' | 'collapsible';
    label: string;
    fields: string[];
    columns?: number;
  }>;
  layout?: 'vertical' | 'horizontal' | 'grid';
  showDescriptions?: boolean;
}

export interface SchemaShowConfig {
  fields?: string[];
  layout?: 'default' | 'tabs' | 'sidebar';
}

export interface NestedSchemaConfig {
  fields: SchemaField[];
  form?: SchemaFormConfig;
  icon?: string;
  label: string;
  list?: SchemaListConfig;
  parentField?: string;
  show?: SchemaShowConfig;
}

export interface SchemaResourceConfig {
  access?: AccessConfig;
  canCreate?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  canShow?: boolean;
  description?: string;
  fields: SchemaField[];
  form?: SchemaFormConfig;
  hooks?: ResourceHooks;
  icon?: string;
  label: string;
  list?: SchemaListConfig;
  nested?: Record<string, NestedSchemaConfig>;
  show?: SchemaShowConfig;
}

export type AdminSchema = Record<string, SchemaResourceConfig>;

export interface ResolvedNestedResource
  extends Omit<NestedSchemaConfig, 'fields'> {
  fields: Map<string, SchemaField>;
  fieldsArray: SchemaField[];
  parentField: string;
  parentResource: string;
  paths: {
    list: string;
    create: string;
    show: string;
    edit: string;
  };
}

export interface ResolvedResource
  extends Omit<SchemaResourceConfig, 'fields' | 'nested'> {
  displayField: string;
  fields: Map<string, SchemaField>;
  fieldsArray: SchemaField[];
  meta: {
    label: string;
    icon?: string;
    description?: string;
  };
  name: string;
  nested: Map<string, ResolvedNestedResource>;
  paths: {
    list: string;
    create: string;
    show: string;
    edit: string;
  };
}

export interface MenuItem {
  icon?: string;
  key: string;
  label: string;
  meta: {
    label: string;
    icon?: string;
    description?: string;
  };
  name: string;
  route: string;
}

export interface ResolvedAdminSchema {
  menu: MenuItem[];
  resourceNames: string[];
  resources: Map<string, ResolvedResource>;
}

interface ComputedConfig {
  deps: string[];
  fn: (data: Record<string, unknown>) => unknown;
}

function getComputedConfig(field: FieldConfig): ComputedConfig | null {
  if (!field.computed) {
    return null;
  }
  if (typeof field.computed === 'function') {
    return null;
  }
  return field.computed as ComputedConfig;
}

function findCyclePath(
  startNode: string,
  graph: Map<string, Set<string>>
): string[] {
  const path: string[] = [];
  const visited = new Set<string>();

  function dfs(node: string): boolean {
    if (node === startNode && path.length > 0) {
      return true;
    }
    if (visited.has(node)) {
      return false;
    }

    visited.add(node);
    path.push(node);

    const deps = graph.get(node);
    if (deps) {
      for (const dep of deps) {
        if (dfs(dep)) {
          return true;
        }
      }
    }

    path.pop();
    return false;
  }

  dfs(startNode);
  return path;
}

export function detectCircularDependencies(
  fields: (FieldConfig | SchemaField)[],
  resourceName?: string
): void {
  const graph = new Map<string, Set<string>>();

  for (const field of fields) {
    let deps: string[] | undefined;

    if ('type' in field && field.type === 'computed') {
      deps = (field as ComputedSchemaField).deps;
    } else {
      const config = getComputedConfig(field as FieldConfig);
      deps = config?.deps;
    }

    if (deps) {
      graph.set(field.name, new Set(deps));
    }
  }

  const visited = new Set<string>();
  const path = new Set<string>();

  function hasCycle(node: string, currentPath: Set<string>): boolean {
    if (currentPath.has(node)) {
      return true;
    }
    if (visited.has(node)) {
      return false;
    }

    visited.add(node);
    currentPath.add(node);

    const deps = graph.get(node);
    if (deps) {
      for (const dep of deps) {
        if (hasCycle(dep, currentPath)) {
          return true;
        }
      }
    }

    currentPath.delete(node);
    return false;
  }

  for (const field of fields) {
    let hasDeps = false;

    if ('type' in field && field.type === 'computed') {
      hasDeps = !!(field as ComputedSchemaField).deps;
    } else {
      const config = getComputedConfig(field as FieldConfig);
      hasDeps = !!config?.deps;
    }

    if (hasDeps) {
      visited.clear();
      path.clear();
      if (hasCycle(field.name, path)) {
        const cyclePath = findCyclePath(field.name, graph);
        const resourcePrefix = resourceName
          ? `in resource "${resourceName}" `
          : '';
        throw new Error(
          `Circular dependency detected ${resourcePrefix}in field "${field.name}". ` +
            `Cycle: ${cyclePath.join(' -> ')} -> ${field.name}`
        );
      }
    }
  }
}

export function computeFieldValues(
  fields: FieldConfig[],
  data: Record<string, unknown>
): Record<string, unknown> {
  const computedFields = fields.filter((f) => f.computed);
  const result = { ...data };
  const computed = new Set<string>();

  function computeField(field: FieldConfig): unknown {
    if (computed.has(field.name)) {
      return result[field.name];
    }

    if (!field.computed) {
      return data[field.name];
    }

    computed.add(field.name);

    const config = getComputedConfig(field);
    if (!config) {
      if (typeof field.computed === 'function') {
        return (field.computed as (data: Record<string, unknown>) => unknown)(
          result
        );
      }
      return data[field.name];
    }

    const deps: Record<string, unknown> = {};
    for (const depName of config.deps) {
      const depField = fields.find((f) => f.name === depName);
      if (depField) {
        deps[depName] = computeField(depField);
      } else {
        deps[depName] = result[depName];
      }
    }

    const computedValue = config.fn({ ...result, ...deps });
    result[field.name] = computedValue;
    return computedValue;
  }

  for (const field of computedFields) {
    result[field.name] = computeField(field);
  }

  return result;
}

function buildNestedResource(
  resourceName: string,
  nestedName: string,
  nestedConfig: NestedSchemaConfig
): ResolvedNestedResource {
  const parentField = nestedConfig.parentField ?? `${resourceName}_id`;

  const nestedFieldsMap = new Map<string, SchemaField>();
  for (const field of nestedConfig.fields) {
    nestedFieldsMap.set(field.name, field);
  }

  return {
    ...nestedConfig,
    parentResource: resourceName,
    parentField,
    fields: nestedFieldsMap,
    fieldsArray: nestedConfig.fields,
    paths: {
      list: `/${resourceName}/:id/${nestedName}`,
      create: `/${resourceName}/:id/${nestedName}/create`,
      show: `/${resourceName}/:id/${nestedName}/:nestedId`,
      edit: `/${resourceName}/:id/${nestedName}/:nestedId/edit`,
    },
  };
}

function buildNestedMap(
  resourceName: string,
  nested?: Record<string, NestedSchemaConfig>
): Map<string, ResolvedNestedResource> {
  const nestedMap = new Map<string, ResolvedNestedResource>();
  if (!nested) {
    return nestedMap;
  }

  for (const [nestedName, nestedConfig] of Object.entries(nested)) {
    nestedMap.set(
      nestedName,
      buildNestedResource(resourceName, nestedName, nestedConfig)
    );
  }

  return nestedMap;
}

function buildFieldsMap(fields: SchemaField[]): Map<string, SchemaField> {
  const fieldsMap = new Map<string, SchemaField>();
  for (const field of fields) {
    fieldsMap.set(field.name, field);
  }
  return fieldsMap;
}

function getDisplayField(fields: SchemaField[]): string {
  return (
    fields.find((f) => f.name === 'name' || f.name === 'title')?.name || 'id'
  );
}

function createResourcePaths(resourceName: string) {
  return {
    list: `/${resourceName}`,
    create: `/${resourceName}/create`,
    show: `/${resourceName}/:id`,
    edit: `/${resourceName}/:id/edit`,
  };
}

export function defineSchema<T extends AdminSchema>(
  schema: T
): ResolvedAdminSchema {
  if ('resources' in schema && schema.resources instanceof Map) {
    throw new Error(
      'defineSchema() received an already-resolved schema. ' +
        'Pass a plain AdminSchema object instead of a ResolvedAdminSchema.'
    );
  }

  const resources = new Map<string, ResolvedResource>();
  const menu: MenuItem[] = [];
  const resourceNames: string[] = [];

  for (const [resourceName, config] of Object.entries(schema)) {
    if (!Array.isArray(config.fields)) {
      throw new Error(
        `Resource "${resourceName}" must have a "fields" array. ` +
          `Received: ${typeof config.fields}`
      );
    }

    detectCircularDependencies(config.fields, resourceName);

    const displayField = getDisplayField(config.fields);
    const fieldsMap = buildFieldsMap(config.fields);
    const nestedMap = buildNestedMap(resourceName, config.nested);

    const resolvedResource: ResolvedResource = {
      ...config,
      name: resourceName,
      displayField,
      fields: fieldsMap,
      fieldsArray: config.fields,
      meta: {
        label: config.label,
        icon: config.icon,
        description: config.description,
      },
      nested: nestedMap,
      canCreate: config.canCreate ?? true,
      canEdit: config.canEdit ?? true,
      canDelete: config.canDelete ?? true,
      canShow: config.canShow ?? true,
      paths: createResourcePaths(resourceName),
    };

    resources.set(resourceName, resolvedResource);
    resourceNames.push(resourceName);

    menu.push({
      name: resourceName,
      key: resourceName,
      label: config.label,
      icon: config.icon,
      route: `/${resourceName}`,
      meta: {
        label: config.label,
        icon: config.icon,
        description: config.description,
      },
    });
  }

  return {
    resources,
    menu,
    resourceNames,
  };
}

export type ResourceNames<T extends AdminSchema> = keyof T & string;

export type FieldNames<
  T extends AdminSchema,
  K extends keyof T,
> = T[K]['fields'][number]['name'];
