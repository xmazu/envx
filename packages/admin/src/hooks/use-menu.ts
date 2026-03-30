'use client';

import { useContext, useMemo } from 'react';

import type { TreeMenuItem } from '@/types';

import { ResourcesContext } from './use-resources';

export interface UseMenuResult {
  menuItems: TreeMenuItem[];
  selectedKey?: string;
}

export function useMenu(): UseMenuResult {
  const context = useContext(ResourcesContext);

  return useMemo(() => {
    return {
      menuItems: context?.schema.menu ?? [],
      selectedKey: context?.selectedKey,
    };
  }, [context]);
}
