import type React from 'react';
import { AdminProvider } from '../components/admin-provider';
import type {
  AdminSchema,
  ResolvedAdminSchema,
  ResolvedResource,
  SchemaField,
} from '../lib/schema-types';
import type { AdminViews } from '../lib/view-types';
import { fetchAllSchemas } from '../server/introspection';
import type { AuthClient } from '../types';
import type { IntrospectedTable } from '../types/resources';

export interface AdminServerProviderProps {
  authClient?: AuthClient;
  children: React.ReactNode;
  schema: ResolvedAdminSchema;
  views?: AdminViews<AdminSchema>;
}

function inferTypeFromPostgres(dataType: string): string {
  const typeMap: Record<string, string> = {
    'character varying': 'text',
    varchar: 'text',
    character: 'text',
    char: 'text',
    text: 'textarea',
    integer: 'integer',
    bigint: 'integer',
    smallint: 'integer',
    numeric: 'number',
    decimal: 'number',
    real: 'number',
    'double precision': 'number',
    boolean: 'boolean',
    date: 'date',
    'timestamp without time zone': 'datetime',
    'timestamp with time zone': 'datetime',
    json: 'json',
    jsonb: 'json',
    uuid: 'uuid',
  };
  return typeMap[dataType.toLowerCase()] || 'text';
}

function enhanceSchemaWithIntrospection(
  schema: ResolvedAdminSchema,
  tables: IntrospectedTable[]
): ResolvedAdminSchema {
  const tableMap = new Map(tables.map((t) => [t.name, t]));
  const enhancedResources = new Map<string, ResolvedResource>();

  for (const [resourceName, resourceConfig] of schema.resources.entries()) {
    const table = tableMap.get(resourceName);

    if (table) {
      const columnMap = new Map(table.columns.map((c) => [c.name, c]));

      const enhancedFieldsArray: SchemaField[] = resourceConfig.fieldsArray.map(
        (field) => {
          const column = columnMap.get(field.name);

          if (column) {
            return {
              ...field,
              type: (field.type ||
                inferTypeFromPostgres(column.dataType)) as SchemaField['type'],
              required:
                field.required ??
                (!column.isNullable && column.defaultValue === null),
              readOnly: field.readOnly ?? column.isPrimaryKey,
            } as SchemaField;
          }

          return field;
        }
      );

      const enhancedFieldsMap = new Map<string, SchemaField>();
      for (const field of enhancedFieldsArray) {
        enhancedFieldsMap.set(field.name, field);
      }

      const enhancedResource: ResolvedResource = {
        ...resourceConfig,
        fields: enhancedFieldsMap,
        fieldsArray: enhancedFieldsArray,
      };

      enhancedResources.set(resourceName, enhancedResource);
    } else {
      enhancedResources.set(resourceName, resourceConfig);
    }
  }

  return {
    ...schema,
    resources: enhancedResources,
  };
}

export async function AdminServerProvider({
  authClient,
  children,
  schema,
  views,
}: AdminServerProviderProps) {
  let tables: IntrospectedTable[] = [];

  try {
    tables = await fetchAllSchemas();
  } catch (error) {
    console.warn('Failed to fetch database introspection:', error);
  }

  const enhancedSchema = enhanceSchemaWithIntrospection(schema, tables);

  return (
    <AdminProvider
      authClient={authClient}
      schema={enhancedSchema}
      views={views}
    >
      {children}
    </AdminProvider>
  );
}
