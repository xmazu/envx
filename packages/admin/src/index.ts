export type { AdminResource, AdminResourcesConfig } from './client/resources';

export { createAdminResources } from './client/resources';
export { AdminProvider } from './components/admin-provider';
export { AutoForm } from './components/auto-form';
export type {
  BulkAction,
  BulkOperationsProps,
} from './components/bulk-operations';
export { BulkOperations } from './components/bulk-operations';
export { DynamicAdminPage } from './components/dynamic-admin-page';
export { FieldArray } from './components/field-array';
export { FieldRenderer } from './components/field-renderer';
export { RelationshipField } from './components/relationship-field';
export {
  ResourceProvider,
  useResource,
  useResourceConfig,
  useResources,
} from './components/resource-provider';
export { detectCircularDependencies } from './lib/circular-deps';
export type {
  ListActionsSlotProps,
  ListCellSlotProps,
  ListFilterSlotProps,
  ListHeaderSlotProps,
  ListRowSlotProps,
  ListViewSlots,
} from './lib/list-view-slots';
export type {
  DefinedResource,
  DefineResourceOptions,
  ResourceRegistry,
} from './lib/resource-definition';
export {
  createMergedConfig,
  defineResource,
  mergeFields,
  resourceRegistry,
} from './lib/resource-definition';
export type {
  FieldConfig,
  FieldType,
  FormFieldGroup,
  FormLayout,
  FormViewConfig,
  ListViewConfig,
  ResourceConfig,
  SelectOption,
} from './lib/resource-protocol';
export { autoGenerateField, POSTGRES_TYPE_MAP } from './lib/resource-protocol';
export { generateZodSchema } from './lib/schema-generator';
export type { PostgRESTDataProviderConfig } from './server/data-provider';
export { createPostgRESTDataProvider } from './server/data-provider';
export type { DataProvider } from './server/resource-handler';
export {
  createResourceHandler,
  ResourceHandler,
} from './server/resource-handler';
export type { PostgRESTProxyConfig, RouteContext } from './server/router';
export { createPostgRESTProxy } from './server/router';
