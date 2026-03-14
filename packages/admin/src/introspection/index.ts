/**
 * Database introspection utilities for PostgreSQL via PostgREST
 * Fetches schema information from information_schema
 */

export interface ColumnInfo {
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

export interface TableSchema {
  columns: ColumnInfo[];
  foreignKeys: ForeignKeyInfo[];
  name: string;
  primaryKey: string | null;
}

export interface IntrospectionConfig {
  apiUrl: string;
  headers?: Record<string, string>;
}

/**
 * Fetch list of all tables in public schema
 */
export async function fetchTables(
  config: IntrospectionConfig
): Promise<string[]> {
  const { apiUrl, headers = {} } = config;

  const response = await fetch(
    `${apiUrl}/information_schema.tables?select=table_name&table_schema=eq.public&table_type=eq.BASE TABLE&order=table_name`,
    { headers: { Accept: 'application/json', ...headers } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch tables: ${response.statusText}`);
  }

  const data = await response.json();
  return data.map((row: { table_name: string }) => row.table_name);
}

/**
 * Fetch column information for a specific table
 */
export async function fetchColumns(
  config: IntrospectionConfig,
  tableName: string
): Promise<ColumnInfo[]> {
  const { apiUrl, headers = {} } = config;

  const response = await fetch(
    `${apiUrl}/information_schema.columns?select=column_name,data_type,is_nullable,column_default&table_schema=eq.public&table_name=eq.${tableName}&order=ordinal_position`,
    { headers: { Accept: 'application/json', ...headers } }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch columns for ${tableName}: ${response.statusText}`
    );
  }

  const data = await response.json();

  // Fetch primary key info
  const pkResponse = await fetch(
    `${apiUrl}/information_schema.table_constraints?select=constraint_name&table_schema=eq.public&table_name=eq.${tableName}&constraint_type=eq.PRIMARY KEY`,
    { headers: { Accept: 'application/json', ...headers } }
  );

  let primaryKey: string | null = null;
  if (pkResponse.ok) {
    const pkData = await pkResponse.json();
    if (pkData.length > 0) {
      const pkConstraint = pkData[0].constraint_name;
      const pkColumnResponse = await fetch(
        `${apiUrl}/information_schema.key_column_usage?select=column_name&constraint_name=eq.${pkConstraint}&table_schema=eq.public&table_name=eq.${tableName}`,
        { headers: { Accept: 'application/json', ...headers } }
      );
      if (pkColumnResponse.ok) {
        const pkColumnData = await pkColumnResponse.json();
        primaryKey = pkColumnData[0]?.column_name || null;
      }
    }
  }

  return data.map(
    (row: {
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string | null;
    }) => ({
      name: row.column_name,
      dataType: row.data_type,
      isNullable: row.is_nullable === 'YES',
      defaultValue: row.column_default,
      isPrimaryKey: row.column_name === primaryKey,
    })
  );
}

/**
 * Fetch foreign key relationships for a table
 */
export async function fetchForeignKeys(
  config: IntrospectionConfig,
  tableName: string
): Promise<ForeignKeyInfo[]> {
  const { apiUrl, headers = {} } = config;

  // PostgREST allows querying via RPC or direct table access
  // For foreign keys, we need to query the constraint views
  const response = await fetch(
    `${apiUrl}/information_schema.table_constraints?select=constraint_name&table_schema=eq.public&table_name=eq.${tableName}&constraint_type=eq.FOREIGN KEY`,
    { headers: { Accept: 'application/json', ...headers } }
  );

  if (!response.ok) {
    return [];
  }

  const constraints = await response.json();
  const foreignKeys: ForeignKeyInfo[] = [];

  for (const constraint of constraints) {
    // Get the column name for this FK
    const columnResponse = await fetch(
      `${apiUrl}/information_schema.key_column_usage?select=column_name&constraint_name=eq.${constraint.constraint_name}&table_schema=eq.public&table_name=eq.${tableName}`,
      { headers: { Accept: 'application/json', ...headers } }
    );

    // Get the referenced table/column
    const refResponse = await fetch(
      `${apiUrl}/information_schema.constraint_column_usage?select=table_name,column_name&constraint_name=eq.${constraint.constraint_name}`,
      { headers: { Accept: 'application/json', ...headers } }
    );

    if (columnResponse.ok && refResponse.ok) {
      const columnData = await columnResponse.json();
      const refData = await refResponse.json();

      if (columnData.length > 0 && refData.length > 0) {
        foreignKeys.push({
          column: columnData[0].column_name,
          foreignTable: refData[0].table_name,
          foreignColumn: refData[0].column_name,
        });
      }
    }
  }

  return foreignKeys;
}

/**
 * Fetch complete schema for a table
 */
export async function fetchTableSchema(
  config: IntrospectionConfig,
  tableName: string
): Promise<TableSchema> {
  const [columns, foreignKeys] = await Promise.all([
    fetchColumns(config, tableName),
    fetchForeignKeys(config, tableName),
  ]);

  const primaryKey = columns.find((c) => c.isPrimaryKey)?.name || null;

  return {
    name: tableName,
    columns,
    foreignKeys,
    primaryKey,
  };
}

/**
 * Fetch schemas for all tables
 */
export async function fetchAllSchemas(
  config: IntrospectionConfig,
  excludeTables: string[] = []
): Promise<TableSchema[]> {
  const tables = await fetchTables(config);
  const filteredTables = tables.filter((t) => !excludeTables.includes(t));

  const schemas = await Promise.all(
    filteredTables.map((table) => fetchTableSchema(config, table))
  );

  return schemas;
}
