'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { ResourceItem, TreeMenuItem } from '@/types/resources';

interface ResourcesContextValue {
  menuItems: TreeMenuItem[];
  resources: ResourceItem[];
  selectedKey?: string;
}

export const ResourcesContext = createContext<ResourcesContextValue>({
  menuItems: [],
  resources: [],
});

export function useResources(): ResourcesContextValue {
  return useContext(ResourcesContext);
}

interface ResourcesProviderProps {
  children: React.ReactNode;
  resources: ResourceItem[];
}

export function ResourcesProvider({
  children,
  resources,
}: ResourcesProviderProps) {
  const value = useMemo(() => {
    const menuItems = buildMenuItems(resources);

    return {
      resources,
      menuItems,
      selectedKey: undefined,
    };
  }, [resources]);

  return React.createElement(ResourcesContext.Provider, { value }, children);
}

function buildMenuItems(resources: ResourceItem[]): TreeMenuItem[] {
  return resources.map((resource) => ({
    name: resource.name,
    key: resource.name,
    route: resource.list,
    label: resource.meta?.label ?? resource.label ?? resource.name,
    icon: resource.meta?.icon ?? resource.icon,
    meta: resource.meta,
  }));
}
