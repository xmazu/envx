'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { resources } from '@/lib/resource-config';
import type { IResourceItem, TreeMenuItem } from '@/types';

interface ResourcesContextValue {
  menuItems: TreeMenuItem[];
  resources: IResourceItem[];
  selectedKey?: string;
}

export const ResourcesContext = createContext<ResourcesContextValue>({
  resources: [],
  menuItems: [],
});

export function useResources(): ResourcesContextValue {
  return useContext(ResourcesContext);
}

interface ResourcesProviderProps {
  children: React.ReactNode;
  customResources?: IResourceItem[];
}

export function ResourcesProvider({
  children,
  customResources,
}: ResourcesProviderProps) {
  const value = useMemo(() => {
    const allResources =
      customResources && customResources.length > 0
        ? customResources
        : resources;
    const menuItems = buildMenuItems(allResources);

    return {
      resources: allResources,
      menuItems,
      selectedKey: undefined,
    };
  }, [customResources]);

  return React.createElement(ResourcesContext.Provider, { value }, children);
}

function buildMenuItems(resources: IResourceItem[]): TreeMenuItem[] {
  return resources.map((resource) => ({
    name: resource.name,
    key: resource.identifier ?? resource.name,
    route: resource.list,
    label: resource.meta?.label ?? resource.label ?? resource.name,
    icon: resource.meta?.icon ?? resource.icon,
    meta: resource.meta,
  }));
}
