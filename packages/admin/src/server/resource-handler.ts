import type { NextRequest } from 'next/server';
import type {
  HookContext,
  ListParams,
  ResourceConfig,
  ResourceHooks,
} from '@/lib/resource-types';

export type ServerHookFunction =
  | ((
      data: Record<string, unknown>,
      context: HookContext
    ) => Promise<Record<string, unknown>>)
  | ((
      data: Record<string, unknown>,
      id: string | number,
      context: HookContext
    ) => Promise<Record<string, unknown>>)
  | ((id: string | number, context: HookContext) => Promise<boolean>)
  | ((id: string | number, context: HookContext) => Promise<void>)
  | ((params: ListParams, context: HookContext) => Promise<ListParams>)
  | ((data: unknown[], context: HookContext) => Promise<unknown[]>);

export interface DataProvider {
  create: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
  delete: (id: string | number) => Promise<void>;
  getList: (params: ListParams) => Promise<{ data: unknown[]; total: number }>;
  getOne: (id: string | number) => Promise<Record<string, unknown>>;
  update: (
    id: string | number,
    data: Record<string, unknown>
  ) => Promise<Record<string, unknown>>;
}

export class ResourceHandler {
  private readonly hooks: ResourceHooks;
  private readonly dataProvider: DataProvider;

  constructor(config: ResourceConfig, dataProvider: DataProvider) {
    this.hooks = config.hooks || {};
    this.dataProvider = dataProvider;
  }

  async handleList(
    params: ListParams,
    context: HookContext
  ): Promise<{ data: unknown[]; total: number }> {
    let modifiedParams = params;

    if (this.hooks.beforeList) {
      modifiedParams = await this.hooks.beforeList(params, context);
    }

    const result = await this.dataProvider.getList(modifiedParams);

    if (this.hooks.afterList) {
      result.data = await this.hooks.afterList(result.data, context);
    }

    return result;
  }

  async handleCreate(
    data: Record<string, unknown>,
    context: HookContext
  ): Promise<Record<string, unknown>> {
    let modifiedData = data;

    if (this.hooks.beforeCreate) {
      modifiedData = await this.hooks.beforeCreate(data, context);
    }

    const result = await this.dataProvider.create(modifiedData);

    if (this.hooks.afterCreate) {
      await this.hooks.afterCreate(result, context);
    }

    return result;
  }

  async handleUpdate(
    id: string | number,
    data: Record<string, unknown>,
    context: HookContext
  ): Promise<Record<string, unknown>> {
    let modifiedData = data;

    if (this.hooks.beforeUpdate) {
      modifiedData = await this.hooks.beforeUpdate(data, id, context);
    }

    const result = await this.dataProvider.update(id, modifiedData);

    if (this.hooks.afterUpdate) {
      await this.hooks.afterUpdate(result, id, context);
    }

    return result;
  }

  async handleDelete(
    id: string | number,
    context: HookContext
  ): Promise<boolean> {
    if (this.hooks.beforeDelete) {
      const shouldDelete = await this.hooks.beforeDelete(id, context);
      if (!shouldDelete) {
        return false;
      }
    }

    await this.dataProvider.delete(id);

    if (this.hooks.afterDelete) {
      await this.hooks.afterDelete(id, context);
    }

    return true;
  }
}

export function createResourceHandler(
  config: ResourceConfig,
  dataProvider: DataProvider
) {
  const handler = new ResourceHandler(config, dataProvider);

  return {
    DELETE: async (
      request: NextRequest,
      { params }: { params: { id: string } }
    ) => {
      const context = createContext(request);
      const success = await handler.handleDelete(params.id, context);

      if (!success) {
        return new Response(JSON.stringify({ error: 'Delete cancelled' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(null, { status: 204 });
    },

    GET: async (
      request: NextRequest,
      { params }: { params: { id?: string } }
    ) => {
      const context = createContext(request);

      if (params.id) {
        const data = await dataProvider.getOne(params.id);
        return new Response(JSON.stringify({ data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const url = new URL(request.url);
      const listParams: ListParams = {
        pagination: {
          current: Number(url.searchParams.get('page')) || 1,
          pageSize: Number(url.searchParams.get('pageSize')) || 10,
        },
      };

      const result = await handler.handleList(listParams, context);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },

    PATCH: async (
      request: NextRequest,
      { params }: { params: { id: string } }
    ) => {
      const context = createContext(request);
      const body = await request.json();

      const result = await handler.handleUpdate(params.id, body, context);
      return new Response(JSON.stringify({ data: result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },

    POST: async (request: NextRequest) => {
      const context = createContext(request);
      const body = await request.json();

      const result = await handler.handleCreate(body, context);
      return new Response(JSON.stringify({ data: result }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  };
}

function createContext(request: NextRequest): HookContext {
  return {
    params: {},
    request,
    response: new Response(),
  };
}
