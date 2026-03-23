'use client';

import { useMemo } from 'react';
import { resources as defaultResources } from '@/lib/resource-config';
import type { IResourceItem, TreeMenuItem } from '@/types';

export interface UseMenuResult {
  menuItems: TreeMenuItem[];
  selectedKey?: string;
}

export function useMenu(customResources?: IResourceItem[]): UseMenuResult {
  return useMemo(() => {
    const allResources = customResources ?? defaultResources;
    const menuItems = buildMenuItems(allResources);

    return {
      menuItems,
      selectedKey: undefined,
    };
  }, [customResources]);
}

function buildMenuItems(resources: IResourceItem[]): TreeMenuItem[] {
  const items: TreeMenuItem[] = [];

  for (const resource of resources) {
    // Skip resources without a list route
    if (!resource.list) {
      continue;
    }

    const item: TreeMenuItem = {
      name: resource.name,
      key: resource.identifier ?? resource.name,
      route: resource.list,
      label: resource.meta?.label ?? resource.label ?? resource.name,
      icon: resource.meta?.icon ?? resource.icon,
      meta: resource.meta,
    };

    items.push(item);
  }

  return items;
}
