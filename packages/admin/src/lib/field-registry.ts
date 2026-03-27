import type { FieldComponentProps } from '@/lib/resource-types';

export type FieldRenderer = React.FC<FieldComponentProps>;

class FieldTypeRegistry {
  private readonly renderers = new Map<string, FieldRenderer>();

  register(type: string, renderer: FieldRenderer): void {
    this.renderers.set(type, renderer);
  }

  get(type: string): FieldRenderer | undefined {
    return this.renderers.get(type);
  }

  has(type: string): boolean {
    return this.renderers.has(type);
  }

  unregister(type: string): boolean {
    return this.renderers.delete(type);
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.renderers.keys());
  }
}

export const fieldRegistry = new FieldTypeRegistry();

export function registerFieldType(type: string, renderer: FieldRenderer): void {
  fieldRegistry.register(type, renderer);
}

export function getFieldRenderer(type: string): FieldRenderer | undefined {
  return fieldRegistry.get(type);
}

export function isFieldTypeRegistered(type: string): boolean {
  return fieldRegistry.has(type);
}
