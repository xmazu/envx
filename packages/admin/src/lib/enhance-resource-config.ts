import type { FieldConfig } from '@/lib/resource-types';
import type {
  IntrospectedColumn,
  IntrospectedTable,
  ResourceConfig,
  ResourceItem,
} from '@/types/resources';

export function enhanceResourceConfigWithIntrospection(
  config: ResourceConfig | undefined,
  tableSchema: IntrospectedTable | undefined
): ResourceConfig | undefined {
  if (!config) {
    return undefined;
  }

  if (!(tableSchema && config.fields) || config.fields.length === 0) {
    return config;
  }

  const enhancedFields: FieldConfig[] = config.fields.map((field) => {
    const column = tableSchema.columns.find((c) => c.name === field.name);
    if (!column) {
      return field;
    }

    return {
      ...field,
      _introspection: {
        dataType: column.dataType,
        isNullable: column.isNullable,
        isPrimaryKey: column.isPrimaryKey,
        defaultValue: column.defaultValue,
      },
    } as FieldConfig & { _introspection?: IntrospectedColumn };
  });

  return {
    ...config,
    fields: enhancedFields,
  };
}

export function enhanceResourcesWithIntrospection(
  resources: ResourceItem[],
  introspectionTables: IntrospectedTable[]
): ResourceItem[] {
  const tableMap = new Map(introspectionTables.map((t) => [t.name, t]));

  return resources.map((resource) => {
    const tableSchema = tableMap.get(resource.name);
    if (!(tableSchema && resource.config)) {
      return resource;
    }

    return {
      ...resource,
      config: enhanceResourceConfigWithIntrospection(
        resource.config,
        tableSchema
      ),
    };
  });
}
