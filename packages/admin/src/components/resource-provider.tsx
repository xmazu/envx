'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  FieldConfig,
  ResourceConfig,
  ResourceDefinition,
} from '@/lib/resource-types';

interface ResourceContextValue {
  getResource: (tableName: string) => ResourceDefinition | undefined;
  getResourceConfig: (tableName: string) => ResourceConfig | undefined;
  registerResource: (resource: ResourceDefinition) => void;
  registerResources: (resources: ResourceDefinition[]) => void;
  resources: ResourceDefinition[];
}

const ResourceContext = createContext<ResourceContextValue | null>(null);

export interface ResourceProviderProps {
  children: React.ReactNode;
  resources?: ResourceDefinition[];
}

export function ResourceProvider({
  children,
  resources: initialResources = [],
}: ResourceProviderProps) {
  const [resources, setResources] =
    useState<ResourceDefinition[]>(initialResources);

  const registerResource = useCallback((resource: ResourceDefinition) => {
    setResources((prev) => {
      const filtered = prev.filter((r) => r.tableName !== resource.tableName);
      return [...filtered, resource];
    });
  }, []);

  const registerResources = useCallback(
    (newResources: ResourceDefinition[]) => {
      setResources((prev) => {
        const newTableNames = new Set(newResources.map((r) => r.tableName));
        const filtered = prev.filter((r) => !newTableNames.has(r.tableName));
        return [...filtered, ...newResources];
      });
    },
    []
  );

  const getResource = useCallback(
    (tableName: string) => {
      return resources.find((r) => r.tableName === tableName);
    },
    [resources]
  );

  const getResourceConfig = useCallback(
    (tableName: string) => {
      return resources.find((r) => r.tableName === tableName)?.config;
    },
    [resources]
  );

  const value = useMemo(
    () => ({
      getResource,
      getResourceConfig,
      registerResource,
      registerResources,
      resources,
    }),
    [
      getResource,
      getResourceConfig,
      registerResource,
      registerResources,
      resources,
    ]
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResources() {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
}

export function useResource(tableName: string) {
  const { getResource } = useResources();
  return getResource(tableName);
}

export function useResourceConfig(tableName: string) {
  const { getResourceConfig } = useResources();
  return getResourceConfig(tableName);
}

export interface FieldVisibilityOptions {
  data: Record<string, unknown>;
  field: FieldConfig;
}

export function useFieldVisibility({ data, field }: FieldVisibilityOptions) {
  return useMemo(() => {
    if (field.hidden) {
      return false;
    }
    if (field.condition) {
      return field.condition(data);
    }
    return true;
  }, [data, field]);
}

export interface ComputedValueOptions {
  data: Record<string, unknown>;
  field: FieldConfig;
}

export function useComputedValue({ data, field }: ComputedValueOptions) {
  return useMemo(() => {
    if (field.computed) {
      if (typeof field.computed === 'function') {
        return field.computed(data);
      }
      return field.computed.fn(data);
    }
    return data[field.name];
  }, [data, field]);
}
