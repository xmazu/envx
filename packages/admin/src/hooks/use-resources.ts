'use client';

import React, { createContext, useContext } from 'react';
import type { AdminSchema, ResolvedAdminSchema } from '@/lib/schema-types';
import type {
  AdminViews,
  FieldRenderer,
  ResolvedViewConfig,
} from '@/lib/view-types';

interface ResourcesContextValue {
  resolvedViews: Record<string, ResolvedViewConfig>;
  schema: ResolvedAdminSchema;
  selectedKey?: string;
}

export const ResourcesContext = createContext<ResourcesContextValue>({
  schema: {
    resources: new Map(),
    menu: [],
    resourceNames: [],
  },
  resolvedViews: {},
});

export function useResources(): ResourcesContextValue {
  return useContext(ResourcesContext);
}

interface ResourcesProviderProps {
  children: React.ReactNode;
  schema: ResolvedAdminSchema;
  views?: AdminViews<AdminSchema>;
}

export function ResourcesProvider({
  children,
  schema,
  views,
}: ResourcesProviderProps) {
  const value = React.useMemo(() => {
    const resolvedViews: Record<string, ResolvedViewConfig> = {};

    for (const resourceName of schema.resources.keys()) {
      const viewConfig = views?.[resourceName as keyof AdminViews<AdminSchema>];

      const fieldsArray: Array<{ name: string; render?: FieldRenderer }> = [];
      if (viewConfig && 'fields' in viewConfig && viewConfig.fields) {
        for (const [name, config] of Object.entries(viewConfig.fields)) {
          const fieldConfig = config as { render?: FieldRenderer } | undefined;
          fieldsArray.push({ name, render: fieldConfig?.render });
        }
      }

      resolvedViews[resourceName] = {
        fields: fieldsArray,
        list: viewConfig?.list || {},
        show: viewConfig?.show || {},
        form: viewConfig?.form || {},
      };
    }

    return {
      schema,
      resolvedViews,
      selectedKey: undefined,
    };
  }, [schema, views]);

  return React.createElement(ResourcesContext.Provider, { value }, children);
}
