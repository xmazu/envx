'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';
import type * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        'oa-:flex oa-:h-full oa-:w-full oa-:flex-col oa-:overflow-hidden oa-:rounded-md oa-:bg-popover oa-:text-popover-foreground',
        className
      )}
      data-slot="command"
      {...props}
    />
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="oa-:sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('oa-:overflow-hidden oa-:p-0', className)}
        showCloseButton={showCloseButton}
      >
        <Command className="oa-:**:data-[slot=command-input-wrapper]:h-12 oa-:[&_[cmdk-group-heading]]:px-2 oa-:[&_[cmdk-group-heading]]:font-medium oa-:[&_[cmdk-group-heading]]:text-muted-foreground oa-:[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 oa-:[&_[cmdk-group]]:px-2 oa-:[&_[cmdk-input-wrapper]_svg]:h-5 oa-:[&_[cmdk-input-wrapper]_svg]:w-5 oa-:[&_[cmdk-input]]:h-12 oa-:[&_[cmdk-item]]:px-2 oa-:[&_[cmdk-item]]:py-3 oa-:[&_[cmdk-item]_svg]:h-5 oa-:[&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      className="oa-:flex oa-:h-9 oa-:items-center oa-:gap-2 oa-:border-b oa-:px-3"
      data-slot="command-input-wrapper"
    >
      <SearchIcon className="oa-:size-4 oa-:shrink-0 oa-:opacity-50" />
      <CommandPrimitive.Input
        className={cn(
          'oa-:flex oa-:h-10 oa-:w-full oa-:rounded-md oa-:bg-transparent oa-:py-3 oa-:text-sm oa-:outline-hidden oa-:placeholder:text-muted-foreground oa-:disabled:cursor-not-allowed oa-:disabled:opacity-50',
          className
        )}
        data-slot="command-input"
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn(
        'oa-:max-h-[300px] oa-:scroll-py-1 oa-:overflow-y-auto oa-:overflow-x-hidden',
        className
      )}
      data-slot="command-list"
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className="oa-:py-6 oa-:text-center oa-:text-sm"
      data-slot="command-empty"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        'oa-:overflow-hidden oa-:p-1 oa-:text-foreground oa-:[&_[cmdk-group-heading]]:px-2 oa-:[&_[cmdk-group-heading]]:py-1.5 oa-:[&_[cmdk-group-heading]]:font-medium oa-:[&_[cmdk-group-heading]]:text-muted-foreground oa-:[&_[cmdk-group-heading]]:text-xs',
        className
      )}
      data-slot="command-group"
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn('oa-:-mx-1 oa-:h-px oa-:bg-border', className)}
      data-slot="command-separator"
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'oa-:relative oa-:flex oa-:cursor-default oa-:select-none oa-:items-center oa-:gap-2 oa-:rounded-sm oa-:px-2 oa-:py-1.5 oa-:text-sm oa-:outline-hidden oa-:data-[disabled=true]:pointer-events-none oa-:data-[selected=true]:bg-accent oa-:data-[selected=true]:text-accent-foreground oa-:data-[disabled=true]:opacity-50 oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg:not([class*=text-])]:text-muted-foreground oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0',
        className
      )}
      data-slot="command-item"
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'oa-:ml-auto oa-:text-muted-foreground oa-:text-xs oa-:tracking-widest',
        className
      )}
      data-slot="command-shortcut"
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
