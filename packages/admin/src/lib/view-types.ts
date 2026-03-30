import type { ComponentType, ReactNode } from 'react';
import type { AdminSchema, FieldNames, ResourceNames } from './schema-types';

export interface FieldRenderProps {
  field: string;
  record: Record<string, unknown>;
  value: unknown;
}

export type FieldRenderer =
  | ComponentType<FieldRenderProps>
  | ((props: FieldRenderProps) => ReactNode);

export interface ListViewSlots {
  after?: ComponentType | (() => ReactNode);
  before?: ComponentType | (() => ReactNode);
  empty?: ComponentType | (() => ReactNode);
  header?: ComponentType | (() => ReactNode);
  toolbar?: Array<ComponentType | (() => ReactNode)>;
}

export interface ListViewConfig {
  slots?: ListViewSlots;
  title?: string;
}

export interface ShowViewTab {
  component: ComponentType<{ record: Record<string, unknown> }>;
  id: string;
  label: string;
}

export interface ShowViewConfig {
  layout?: 'default' | 'tabs' | 'sidebar';
  slots?: {
    before?: ComponentType | (() => ReactNode);
    after?: ComponentType | (() => ReactNode);
  };
  tabs?: ShowViewTab[];
}

export interface FormViewConfig {
  slots?: {
    before?: ComponentType | (() => ReactNode);
    after?: ComponentType | (() => ReactNode);
    footer?: ComponentType | (() => ReactNode);
  };
}

export interface ResourceViewConfig<
  TSchema extends AdminSchema,
  TResource extends ResourceNames<TSchema>,
> {
  fields?: Partial<
    Record<FieldNames<TSchema, TResource>, { render?: FieldRenderer }>
  >;
  form?: FormViewConfig;
  list?: ListViewConfig;
  show?: ShowViewConfig;
}

export type AdminViews<TSchema extends AdminSchema> = {
  [K in ResourceNames<TSchema>]?: ResourceViewConfig<TSchema, K>;
};

export function createViews<TSchema extends AdminSchema>(
  views: AdminViews<TSchema>
): AdminViews<TSchema> {
  return views;
}

export interface ResolvedViewConfig {
  fields: Array<{ name: string; render?: FieldRenderer }>;
  form: FormViewConfig;
  list: ListViewConfig;
  show: ShowViewConfig;
}

export function resolveViews<TSchema extends AdminSchema>(
  schema: TSchema,
  views?: AdminViews<TSchema>
): Record<string, ResolvedViewConfig> {
  const resolved: Record<string, ResolvedViewConfig> = {};

  for (const resourceName of Object.keys(schema)) {
    const viewConfig = views?.[resourceName as ResourceNames<TSchema>];

    const fieldsArray: Array<{ name: string; render?: FieldRenderer }> = [];
    if (viewConfig?.fields) {
      for (const [name, config] of Object.entries(viewConfig.fields)) {
        const fieldConfig = config as { render?: FieldRenderer } | undefined;
        fieldsArray.push({ name, render: fieldConfig?.render });
      }
    }

    resolved[resourceName] = {
      fields: fieldsArray,
      list: viewConfig?.list || {},
      show: viewConfig?.show || {},
      form: viewConfig?.form || {},
    };
  }

  return resolved;
}
