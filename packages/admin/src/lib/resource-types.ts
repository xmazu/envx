import type { ZodType } from 'zod';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'json'
  | 'reference'
  | 'url'
  | 'color'
  | 'phone'
  | 'slug'
  | 'rich-text'
  | 'array'
  | 'custom';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface ReferenceConfig {
  displayField?: string;
  filter?: (query: unknown) => unknown;
  table: string;
  valueField?: string;
}

export interface ComputedConfig {
  deps: string[];
  displayOnly?: boolean;
  fn: (data: Record<string, unknown>) => unknown;
}

export interface BaseFieldConfig {
  className?: string;
  computed?: ComputedConfig | ((data: Record<string, unknown>) => unknown);
  condition?: (data: Record<string, unknown>) => boolean;
  defaultValue?: unknown;
  description?: string;
  hidden?: boolean;
  label?: string;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  type: FieldType;
  validate?: (value: unknown) => boolean | string;
  validation?: ZodType<unknown>;
  width?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  type: 'text';
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  maxLength?: number;
  minLength?: number;
  rows?: number;
  type: 'textarea';
}

export interface NumberFieldConfig extends BaseFieldConfig {
  max?: number;
  min?: number;
  step?: number;
  type: 'number' | 'integer';
}

export interface BooleanFieldConfig extends BaseFieldConfig {
  type: 'boolean';
}

export interface DateFieldConfig extends BaseFieldConfig {
  max?: string;
  min?: string;
  type: 'date' | 'datetime';
}

export interface EmailFieldConfig extends BaseFieldConfig {
  type: 'email';
}

export interface PasswordFieldConfig extends BaseFieldConfig {
  type: 'password';
}

export interface SelectFieldConfig extends BaseFieldConfig {
  options: SelectOption[] | string[];
  type: 'select' | 'multiselect';
}

export interface JsonFieldConfig extends BaseFieldConfig {
  type: 'json';
}

export interface ReferenceFieldConfig extends BaseFieldConfig {
  displayColumn?: string;
  multiple?: boolean;
  reference: ReferenceConfig;
  type: 'reference';
}

export interface UrlFieldConfig extends BaseFieldConfig {
  type: 'url';
}

export interface ColorFieldConfig extends BaseFieldConfig {
  type: 'color';
}

export interface PhoneFieldConfig extends BaseFieldConfig {
  type: 'phone';
}

export interface SlugFieldConfig extends BaseFieldConfig {
  source?: string;
  type: 'slug';
}

export interface RichTextFieldConfig extends BaseFieldConfig {
  type: 'rich-text';
}

export interface ArrayFieldConfig extends BaseFieldConfig {
  maxItems?: number;
  minItems?: number;
  of: { fields?: FieldConfig[]; type: 'object' | 'text' };
  type: 'array';
}

export interface CustomFieldConfig extends BaseFieldConfig {
  component: React.ComponentType<FieldComponentProps>;
  type: 'custom';
}

export interface FieldComponentProps {
  disabled?: boolean;
  error?: string;
  field: FieldConfig;
  onBlur?: () => void;
  onChange: (value: unknown) => void;
  value: unknown;
}

export type FieldConfig =
  | TextFieldConfig
  | TextareaFieldConfig
  | NumberFieldConfig
  | BooleanFieldConfig
  | DateFieldConfig
  | EmailFieldConfig
  | PasswordFieldConfig
  | SelectFieldConfig
  | JsonFieldConfig
  | ReferenceFieldConfig
  | UrlFieldConfig
  | ColorFieldConfig
  | PhoneFieldConfig
  | SlugFieldConfig
  | RichTextFieldConfig
  | ArrayFieldConfig
  | CustomFieldConfig;

export interface ListFilter {
  field: string;
  options?: string[];
  type: 'select' | 'date-range' | 'text';
}

export interface BulkActionConfig {
  confirm?: {
    destructive?: boolean;
    message: string;
    title: string;
  };
  dialog?: {
    fields: Array<{
      label: string;
      name: string;
      options?: string[];
      type: 'text' | 'select';
    }>;
    title: string;
  };
  icon?: string;
  key: string;
  label: string;
}

export interface ListViewConfig {
  actions?: {
    clone?: boolean;
    delete?: boolean;
    edit?: boolean;
    show?: boolean;
  };
  bulkActions?: BulkActionConfig[];
  columns?: string[];
  defaultSort?: { direction: 'asc' | 'desc'; field: string };
  filters?: ListFilter[];
  pageSizeOptions?: number[];
  perPage?: number;
  searchable?: string[];
}

export type FormLayoutItem =
  | {
      columns?: number;
      fields: string[];
      label?: string;
      title?: string;
      type: 'tab';
    }
  | {
      columns?: number;
      fields: string[];
      label?: string;
      title?: string;
      type: 'collapsible';
    }
  | {
      columns?: number;
      fields: string[];
      label?: string;
      title?: string;
      type: 'group';
    };

export interface FormViewConfig {
  columns?: number;
  groups?: FormLayoutItem[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  showDescriptions?: boolean;
}

export type AccessFunction = (
  user: unknown,
  record?: Record<string, unknown>
) => boolean;

export interface AccessConfig {
  create?: AccessFunction;
  delete?: AccessFunction;
  read?: AccessFunction;
  update?: AccessFunction;
}

export interface HookContext {
  db?: unknown;
  params: Record<string, string>;
  request: Request;
  response: Response;
  user?: unknown;
}

export interface ListParams {
  filters?: Array<{ field: string; operator: string; value: unknown }>;
  pagination?: { current?: number; pageSize?: number };
  sorters?: Array<{ direction: 'asc' | 'desc'; field: string }>;
}

export interface ResourceHooks {
  afterCreate?: (
    data: Record<string, unknown>,
    context: HookContext
  ) => Promise<void>;
  afterDelete?: (id: string | number, context: HookContext) => Promise<void>;
  afterList?: (data: unknown[], context: HookContext) => Promise<unknown[]>;
  afterUpdate?: (
    data: Record<string, unknown>,
    id: string | number,
    context: HookContext
  ) => Promise<void>;
  beforeCreate?: (
    data: Record<string, unknown>,
    context: HookContext
  ) => Promise<Record<string, unknown>>;
  beforeDelete?: (
    id: string | number,
    context: HookContext
  ) => Promise<boolean>;
  beforeList?: (
    params: ListParams,
    context: HookContext
  ) => Promise<ListParams>;
  beforeUpdate?: (
    data: Record<string, unknown>,
    id: string | number,
    context: HookContext
  ) => Promise<Record<string, unknown>>;
}
