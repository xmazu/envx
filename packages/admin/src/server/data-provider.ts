/**
 * Refine Data Provider for PostgREST
 * Implements the Refine DataProvider interface using PostgREST REST API
 */

import type {
  BaseRecord,
  CreateParams,
  CreateResponse,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  UpdateParams,
  UpdateResponse,
} from '@refinedev/core';

export interface PostgRESTDataProviderConfig {
  /** PostgREST API base URL */
  apiUrl: string;
  /** JWT token for authentication */
  getToken?: () => string | null;
  /** Default headers for all requests */
  headers?: Record<string, string>;
}

export function createPostgRESTDataProvider(
  config: PostgRESTDataProviderConfig
): DataProvider {
  const { apiUrl, getToken, headers: defaultHeaders = {} } = config;

  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...defaultHeaders,
    };

    const token = getToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  const buildQueryParams = (params: GetListParams): string => {
    const queryParts: string[] = [];

    // Pagination
    if (params.pagination) {
      const pageSize = params.pagination.pageSize ?? 10;
      const currentPage =
        (params.pagination as { current?: number; currentPage?: number })
          .current ??
        (params.pagination as { current?: number; currentPage?: number })
          .currentPage ??
        1;
      const offset = (currentPage - 1) * pageSize;
      queryParts.push(`limit=${pageSize}&offset=${offset}`);
    }

    // Sorting
    if (params.sorters && params.sorters.length > 0) {
      const orderBy = params.sorters
        .map((s) => `${s.field}.${s.order === 'desc' ? 'desc' : 'asc'}`)
        .join(',');
      queryParts.push(`order=${orderBy}`);
    }

    // Filters
    if (params.filters && params.filters.length > 0) {
      for (const filter of params.filters) {
        if ('field' in filter && filter.operator === 'eq') {
          queryParts.push(`${filter.field}=eq.${filter.value}`);
        }
      }
    }

    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  };

  const dataProvider: DataProvider = {
    getList: async <TData extends BaseRecord = BaseRecord>({
      resource,
      pagination,
      sorters,
      filters,
    }: GetListParams): Promise<GetListResponse<TData>> => {
      const queryParams = buildQueryParams({
        resource,
        pagination,
        sorters,
        filters,
      });
      const response = await fetch(`${apiUrl}/${resource}${queryParams}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch list: ${response.statusText}`);
      }

      // Get total count from Content-Range header
      const contentRange = response.headers.get('Content-Range');
      const total = contentRange
        ? Number.parseInt(contentRange.split('/')[1] || '0', 10)
        : 0;

      const data = await response.json();

      return {
        data: data as TData[],
        total,
      };
    },

    getOne: async <TData extends BaseRecord = BaseRecord>({
      resource,
      id,
    }: GetOneParams): Promise<GetOneResponse<TData>> => {
      const response = await fetch(
        `${apiUrl}/${resource}?id=eq.${id}&limit=1`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch record: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error(`Record not found: ${id}`);
      }

      return {
        data: data[0] as TData,
      };
    },

    create: async <
      TData extends BaseRecord = BaseRecord,
      TVariables = Record<string, unknown>,
    >({
      resource,
      variables,
    }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
      const response = await fetch(`${apiUrl}/${resource}`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          Prefer: 'return=representation',
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        throw new Error(`Failed to create record: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data: (Array.isArray(data) ? data[0] : data) as TData,
      };
    },

    update: async <
      TData extends BaseRecord = BaseRecord,
      TVariables = Record<string, unknown>,
    >({
      resource,
      id,
      variables,
    }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
      const response = await fetch(`${apiUrl}/${resource}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          Prefer: 'return=representation',
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        throw new Error(`Failed to update record: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data: (Array.isArray(data) ? data[0] : data) as TData,
      };
    },

    deleteOne: async <
      TData extends BaseRecord = BaseRecord,
      TVariables = Record<string, unknown>,
    >({
      resource,
      id,
    }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
      const response = await fetch(`${apiUrl}/${resource}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          ...getHeaders(),
          Prefer: 'return=representation',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.statusText}`);
      }

      return {
        data: { id } as TData,
      };
    },

    getApiUrl: () => apiUrl,

    custom: async <
      TData extends BaseRecord = BaseRecord,
      TQuery = unknown,
      TPayload = unknown,
    >({
      url,
      method,
      query,
      payload,
    }: {
      url: string;
      method: string;
      query?: TQuery;
      payload?: TPayload;
    }): Promise<{ data: TData }> => {
      const queryString = query
        ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
        : '';

      const response = await fetch(`${apiUrl}${url}${queryString}`, {
        method,
        headers: getHeaders(),
        body: payload ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Custom request failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data: data as TData,
      };
    },
  };

  return dataProvider;
}
