'use client';

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'oa-:flex oa-:w-fit oa-:items-center oa-:justify-between oa-:gap-2 oa-:whitespace-nowrap oa-:rounded-md oa-:border oa-:border-input oa-:bg-transparent oa-:px-3 oa-:py-2 oa-:text-sm oa-:shadow-xs oa-:outline-none oa-:transition-[color,box-shadow] oa-:focus-visible:border-ring oa-:focus-visible:ring-[3px] oa-:focus-visible:ring-ring/50 oa-:disabled:cursor-not-allowed oa-:disabled:opacity-50 oa-:aria-invalid:border-destructive oa-:aria-invalid:ring-destructive/20 oa-:data-[size=default]:h-9 oa-:data-[size=sm]:h-8 oa-:data-[placeholder]:text-muted-foreground oa-:*:data-[slot=select-value]:line-clamp-1 oa-:*:data-[slot=select-value]:flex oa-:*:data-[slot=select-value]:items-center oa-:*:data-[slot=select-value]:gap-2 oa-:dark:bg-input/30 oa-:dark:aria-invalid:ring-destructive/40 oa-:dark:hover:bg-input/50 oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg:not([class*=text-])]:text-muted-foreground oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0',
        className
      )}
      data-size={size}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="oa-:size-4 oa-:opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'item-aligned',
  align = 'center',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        align={align}
        className={cn(
          'oa-:data-[side=bottom]:slide-in-from-top-2 oa-:data-[side=left]:slide-in-from-right-2 oa-:data-[side=right]:slide-in-from-left-2 oa-:data-[side=top]:slide-in-from-bottom-2 oa-:data-[state=closed]:fade-out-0 oa-:data-[state=closed]:zoom-out-95 oa-:data-[state=open]:fade-in-0 oa-:data-[state=open]:zoom-in-95 oa-:relative oa-:z-50 oa-:max-h-(--radix-select-content-available-height) oa-:min-w-[8rem] oa-:origin-(--radix-select-content-transform-origin) oa-:overflow-y-auto oa-:overflow-x-hidden oa-:rounded-md oa-:border oa-:bg-popover oa-:text-popover-foreground oa-:shadow-md oa-:data-[state=closed]:animate-out oa-:data-[state=open]:animate-in',
          position === 'popper' &&
            'oa-:data-[side=left]:-translate-x-1 oa-:data-[side=right]:translate-x-1 oa-:data-[side=bottom]:translate-y-1 oa-:data-[side=top]:-translate-y-1',
          className
        )}
        data-slot="select-content"
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'oa-:p-1',
            position === 'popper' &&
              'oa-:h-[var(--radix-select-trigger-height)] oa-:w-full oa-:min-w-[var(--radix-select-trigger-width)] oa-:scroll-my-1'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn(
        'oa-:px-2 oa-:py-1.5 oa-:text-muted-foreground oa-:text-xs',
        className
      )}
      data-slot="select-label"
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'oa-:relative oa-:flex oa-:w-full oa-:cursor-default oa-:select-none oa-:items-center oa-:gap-2 oa-:rounded-sm oa-:py-1.5 oa-:pr-8 oa-:pl-2 oa-:text-sm oa-:outline-hidden oa-:focus:bg-accent oa-:focus:text-accent-foreground oa-:data-[disabled]:pointer-events-none oa-:data-[disabled]:opacity-50 oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg:not([class*=text-])]:text-muted-foreground oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0 oa-:*:[span]:last:flex oa-:*:[span]:last:items-center oa-:*:[span]:last:gap-2',
        className
      )}
      data-slot="select-item"
      {...props}
    >
      <span
        className="oa-:absolute oa-:right-2 oa-:flex oa-:size-3.5 oa-:items-center oa-:justify-center"
        data-slot="select-item-indicator"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="oa-:size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        'oa-:pointer-events-none oa-:-mx-1 oa-:my-1 oa-:h-px oa-:bg-border',
        className
      )}
      data-slot="select-separator"
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        'oa-:flex oa-:cursor-default oa-:items-center oa-:justify-center oa-:py-1',
        className
      )}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUpIcon className="oa-:size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        'oa-:flex oa-:cursor-default oa-:items-center oa-:justify-center oa-:py-1',
        className
      )}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDownIcon className="oa-:size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
