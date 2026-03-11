/**
 * PostgREST proxy router for Next.js
 * Proxies requests to PostgREST server with introspection endpoints
 */

import { type NextRequest, NextResponse } from 'next/server';
import { fetchColumns, fetchTableSchema, fetchTables } from './introspection';

export interface PostgRESTProxyConfig {
  /** Function to get JWT token for authentication */
  getToken?: (request: NextRequest) => string | null;
  /** PostgREST API URL */
  postgrestUrl: string;
  /** Optional request transform */
  transformRequest?: (
    request: NextRequest
  ) => Promise<NextRequest> | NextRequest;
}

export interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export function createPostgRESTProxy(config: PostgRESTProxyConfig) {
  const { postgrestUrl, getToken, transformRequest } = config;

  async function handleIntrospection(
    request: NextRequest,
    path: string[]
  ): Promise<NextResponse | null> {
    // Handle introspection endpoints: /api/admin/introspection/...
    if (path[0] !== 'introspection') {
      return null;
    }

    const subPath = path.slice(1);

    try {
      // GET /api/admin/introspection/tables
      if (subPath[0] === 'tables' && request.method === 'GET') {
        const tables = await fetchTables();
        return NextResponse.json(tables.map((name) => ({ table_name: name })));
      }

      // GET /api/admin/introspection/columns/:table
      if (subPath[0] === 'columns' && subPath[1] && request.method === 'GET') {
        const tableName = subPath[1];
        const columns = await fetchColumns(tableName);
        return NextResponse.json(
          columns.map((col) => ({
            column_name: col.name,
            data_type: col.dataType,
            is_nullable: col.isNullable ? 'YES' : 'NO',
            column_default: col.defaultValue,
          }))
        );
      }

      // GET /api/admin/introspection/schema/:table
      if (subPath[0] === 'schema' && subPath[1] && request.method === 'GET') {
        const tableName = subPath[1];
        const schema = await fetchTableSchema(tableName);
        return NextResponse.json(schema);
      }

      return NextResponse.json(
        { error: 'Invalid introspection endpoint' },
        { status: 404 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: 'Introspection error', message: String(error) },
        { status: 500 }
      );
    }
  }

  async function proxyRequest(
    request: NextRequest,
    context: RouteContext
  ): Promise<NextResponse> {
    const params = await context.params;
    const path = params.path || [];

    // Check if this is an introspection request
    const introspectionResponse = await handleIntrospection(request, path);
    if (introspectionResponse) {
      return introspectionResponse;
    }

    // Regular PostgREST proxy
    const pathStr = path.join('/');

    // Build target URL
    const url = new URL(request.url);
    const targetUrl = new URL(pathStr + url.search, postgrestUrl);

    // Prepare headers
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.set('host', new URL(postgrestUrl).host);

    // Add auth token if provided
    const token = getToken?.(request);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    // Transform request if needed
    if (transformRequest) {
      await transformRequest(request);
    }

    // Forward to PostgREST
    try {
      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method)
          ? null
          : await request.text(),
      });

      // Build response
      const responseHeaders = new Headers(response.headers);
      responseHeaders.delete('content-encoding');

      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Proxy error', message: String(error) },
        { status: 502 }
      );
    }
  }

  return {
    GET: proxyRequest,
    POST: proxyRequest,
    PUT: proxyRequest,
    PATCH: proxyRequest,
    DELETE: proxyRequest,
  };
}
