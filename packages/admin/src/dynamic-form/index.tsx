/**
 * Dynamic form field components based on PostgreSQL types
 */

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ColumnInfo, ForeignKeyInfo } from '../server/introspection';

interface DynamicFieldProps {
  column: ColumnInfo;
  foreignKey?: ForeignKeyInfo;
}

/**
 * Map PostgreSQL type to input type
 */
function getInputType(dataType: string): string {
  const typeMap: Record<string, string> = {
    text: 'text',
    'character varying': 'text',
    character: 'text',
    integer: 'number',
    bigint: 'number',
    numeric: 'number',
    decimal: 'number',
    real: 'number',
    'double precision': 'number',
    boolean: 'checkbox',
    'timestamp without time zone': 'datetime-local',
    'timestamp with time zone': 'datetime-local',
    date: 'date',
    time: 'time',
    json: 'textarea',
    jsonb: 'textarea',
    uuid: 'text',
  };
  return typeMap[dataType] || 'text';
}

/**
 * Foreign key autocomplete component
 */
function ForeignKeyField({ column, foreignKey }: DynamicFieldProps) {
  const { register, setValue, watch } = useFormContext();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const value = watch(column.name);
  const selectedLabel = options.find((o) => o.id === value)?.label || value;

  const searchReferences = async (search: string) => {
    if (!foreignKey) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/references/${foreignKey.foreignTable}?q=${encodeURIComponent(search)}`
      );
      if (response.ok) {
        const data = await response.json();
        setOptions(data);
      }
    } catch (error) {
      console.error('Failed to fetch references:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={column.name}>
        {column.name}
        {!column.isNullable && <span className="text-red-500">*</span>}
      </Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="w-full justify-between"
            role="combobox"
            variant="outline"
          >
            {selectedLabel ||
              `Select ${foreignKey?.foreignTable ?? 'reference'}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              onValueChange={searchReferences}
              placeholder={`Search ${foreignKey?.foreignTable ?? 'reference'}...`}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? 'Loading...' : 'No results found.'}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={(currentValue) => {
                      setValue(column.name, currentValue);
                      setOpen(false);
                    }}
                    value={option.id}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" {...register(column.name)} />
    </div>
  );
}

/**
 * Dynamic field component that renders appropriate input based on column type
 */
export function DynamicField({ column, foreignKey }: DynamicFieldProps) {
  const { register } = useFormContext();
  const inputType = getInputType(column.dataType);

  // Handle foreign keys with autocomplete
  if (foreignKey) {
    return <ForeignKeyField column={column} foreignKey={foreignKey} />;
  }

  // Handle boolean/checkbox
  if (inputType === 'checkbox') {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox id={column.name} {...register(column.name)} />
        <Label htmlFor={column.name}>{column.name}</Label>
      </div>
    );
  }

  // Handle JSON/textarea
  if (inputType === 'textarea') {
    return (
      <div className="space-y-2">
        <Label htmlFor={column.name}>
          {column.name}
          {!column.isNullable && <span className="text-red-500">*</span>}
        </Label>
        <Textarea
          id={column.name}
          {...register(column.name)}
          placeholder={column.name}
        />
      </div>
    );
  }

  // Handle datetime-local - format value for input
  if (inputType === 'datetime-local') {
    return (
      <div className="space-y-2">
        <Label htmlFor={column.name}>
          {column.name}
          {!column.isNullable && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id={column.name}
          type="datetime-local"
          {...register(column.name)}
          disabled={column.isPrimaryKey}
        />
      </div>
    );
  }

  // Default text/number input
  return (
    <div className="space-y-2">
      <Label htmlFor={column.name}>
        {column.name}
        {!column.isNullable && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={column.name}
        type={inputType}
        {...register(column.name)}
        disabled={column.isPrimaryKey}
        placeholder={column.name}
      />
    </div>
  );
}

/**
 * Generate form fields from table schema
 */
export interface DynamicFormProps {
  columns: ColumnInfo[];
  excludeColumns?: string[];
  foreignKeys: ForeignKeyInfo[];
}

export function DynamicForm({
  columns,
  foreignKeys,
  excludeColumns = [],
}: DynamicFormProps) {
  const fkMap = new Map(foreignKeys.map((fk) => [fk.column, fk]));

  // Filter out excluded columns (like created_at, updated_at)
  const visibleColumns = columns.filter(
    (col) => !excludeColumns.includes(col.name)
  );

  return (
    <div className="space-y-4">
      {visibleColumns.map((column) => (
        <DynamicField
          column={column}
          foreignKey={fkMap.get(column.name)}
          key={column.name}
        />
      ))}
    </div>
  );
}
