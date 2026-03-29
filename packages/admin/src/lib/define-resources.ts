import * as Icons from 'lucide-react';
import React, { type ReactNode } from 'react';
import type {
  NestedResourceConfig,
  ResourceItem,
  ResourcesConfig,
} from '@/types/resources';

function getIcon(iconName: string | undefined): ReactNode {
  if (!iconName) {
    return undefined;
  }
  const Icon = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[iconName];
  return Icon ? React.createElement(Icon) : undefined;
}

function buildNestedRoutes(
  parentName: string,
  nested: Record<string, NestedResourceConfig> | undefined
): ResourceItem['nested'] {
  if (!nested) {
    return undefined;
  }

  const result: NonNullable<ResourceItem['nested']> = {};

  for (const [name, config] of Object.entries(nested)) {
    const icon = getIcon(config.icon);

    result[name] = {
      name,
      label: config.label,
      icon,
      list: `/${parentName}/:id/${name}`,
      create: `/${parentName}/:id/${name}/create`,
      edit: `/${parentName}/:id/${name}/:nestedId/edit`,
      show: `/${parentName}/:id/${name}/:nestedId`,
      parentField: config.parentField,
      meta: {
        label: config.label,
        icon,
      },
    };
  }

  return result;
}

export function defineResources(config: ResourcesConfig): ResourceItem[] {
  const resources: ResourceItem[] = [];

  for (const [name, resourceConfig] of Object.entries(config)) {
    const icon = getIcon(resourceConfig.icon);

    const resource: ResourceItem = {
      name,
      label: resourceConfig.label,
      icon,
      list: `/${name}`,
      create: `/${name}/create`,
      edit: `/${name}/:id/edit`,
      show: `/${name}/:id`,
      meta: {
        label: resourceConfig.label,
        icon,
        description: resourceConfig.description,
      },
      nested: buildNestedRoutes(name, resourceConfig.nested),
      displayField: resourceConfig.displayField ?? 'name',
    };

    resources.push(resource);
  }

  return resources;
}
