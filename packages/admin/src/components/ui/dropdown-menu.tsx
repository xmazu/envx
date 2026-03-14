'use client';

import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(
          'oa-:data-[side=bottom]:slide-in-from-top-2 oa-:data-[side=left]:slide-in-from-right-2 oa-:data-[side=right]:slide-in-from-left-2 oa-:data-[side=top]:slide-in-from-bottom-2 oa-:data-[state=closed]:fade-out-0 oa-:data-[state=closed]:zoom-out-95 oa-:data-[state=open]:fade-in-0 oa-:data-[state=open]:zoom-in-95 oa-:z-50 oa-:max-h-(--radix-dropdown-menu-content-available-height) oa-:min-w-[8rem] oa-:origin-(--radix-dropdown-menu-content-transform-origin) oa-:overflow-y-auto oa-:overflow-x-hidden oa-:rounded-md oa-:border oa-:bg-popover oa-:p-1 oa-:text-popover-foreground oa-:shadow-md oa-:data-[state=closed]:animate-out oa-:data-[state=open]:animate-in',
          className
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'oa-:relative oa-:flex oa-:cursor-default oa-:select-none oa-:items-center oa-:gap-2 oa-:rounded-sm oa-:px-2 oa-:py-1.5 oa-:text-sm oa-:outline-hidden oa-:focus:bg-accent oa-:focus:text-accent-foreground oa-:data-[disabled]:pointer-events-none oa-:data-[inset]:pl-8 oa-:data-[variant=destructive]:text-destructive oa-:data-[disabled]:opacity-50 oa-:data-[variant=destructive]:focus:bg-destructive/10 oa-:data-[variant=destructive]:focus:text-destructive oa-:dark:data-[variant=destructive]:focus:bg-destructive/20 oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg:not([class*=text-])]:text-muted-foreground oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0 oa-:data-[variant=destructive]:*:[svg]:text-destructive!',
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        'oa-:relative oa-:flex oa-:cursor-default oa-:select-none oa-:items-center oa-:gap-2 oa-:rounded-sm oa-:py-1.5 oa-:pr-2 oa-:pl-8 oa-:text-sm oa-:outline-hidden oa-:focus:bg-accent oa-:focus:text-accent-foreground oa-:data-[disabled]:pointer-events-none oa-:data-[disabled]:opacity-50 oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0',
        className
      )}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <span className="oa-:pointer-events-none oa-:absolute oa-:left-2 oa-:flex oa-:size-3.5 oa-:items-center oa-:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="oa-:size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        'oa-:relative oa-:flex oa-:cursor-default oa-:select-none oa-:items-center oa-:gap-2 oa-:rounded-sm oa-:py-1.5 oa-:pr-2 oa-:pl-8 oa-:text-sm oa-:outline-hidden oa-:focus:bg-accent oa-:focus:text-accent-foreground oa-:data-[disabled]:pointer-events-none oa-:data-[disabled]:opacity-50 oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0',
        className
      )}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <span className="oa-:pointer-events-none oa-:absolute oa-:left-2 oa-:flex oa-:size-3.5 oa-:items-center oa-:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="oa-:size-2 oa-:fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        'oa-:px-2 oa-:py-1.5 oa-:font-medium oa-:text-sm oa-:data-[inset]:pl-8',
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('oa-:-mx-1 oa-:my-1 oa-:h-px oa-:bg-border', className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'oa-:ml-auto oa-:text-muted-foreground oa-:text-xs oa-:tracking-widest',
        className
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        'oa-:flex oa-:cursor-default oa-:select-none oa-:items-center oa-:gap-2 oa-:rounded-sm oa-:px-2 oa-:py-1.5 oa-:text-sm oa-:outline-hidden oa-:focus:bg-accent oa-:focus:text-accent-foreground oa-:data-[state=open]:bg-accent oa-:data-[inset]:pl-8 oa-:data-[state=open]:text-accent-foreground oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg:not([class*=text-])]:text-muted-foreground oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0',
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className="oa-:ml-auto oa-:size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        'oa-:data-[side=bottom]:slide-in-from-top-2 oa-:data-[side=left]:slide-in-from-right-2 oa-:data-[side=right]:slide-in-from-left-2 oa-:data-[side=top]:slide-in-from-bottom-2 oa-:data-[state=closed]:fade-out-0 oa-:data-[state=closed]:zoom-out-95 oa-:data-[state=open]:fade-in-0 oa-:data-[state=open]:zoom-in-95 oa-:z-50 oa-:min-w-[8rem] oa-:origin-(--radix-dropdown-menu-content-transform-origin) oa-:overflow-hidden oa-:rounded-md oa-:border oa-:bg-popover oa-:p-1 oa-:text-popover-foreground oa-:shadow-lg oa-:data-[state=closed]:animate-out oa-:data-[state=open]:animate-in',
        className
      )}
      data-slot="dropdown-menu-sub-content"
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
