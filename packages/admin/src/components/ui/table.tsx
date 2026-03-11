'use client';

import type * as React from 'react';

import { cn } from '@/lib/utils';

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      className="oa-:relative oa-:w-full oa-:overflow-x-auto"
      data-slot="table-container"
    >
      <table
        className={cn('oa-:w-full oa-:caption-bottom oa-:text-sm', className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      className={cn('oa-:[&_tr]:border-b', className)}
      data-slot="table-header"
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      className={cn('oa-:[&_tr:last-child]:border-0', className)}
      data-slot="table-body"
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      className={cn(
        'oa-:border-t oa-:bg-muted/50 oa-:font-medium oa-:[&>tr]:last:border-b-0',
        className
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      className={cn(
        'oa-:border-b oa-:transition-colors oa-:hover:bg-muted/50 oa-:data-[state=selected]:bg-muted',
        className
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'oa-:h-10 oa-:whitespace-nowrap oa-:px-2 oa-:text-left oa-:align-middle oa-:font-medium oa-:text-foreground oa-:[&:has([role=checkbox])]:pr-0 oa-:[&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      className={cn(
        'oa-:whitespace-nowrap oa-:p-2 oa-:align-middle oa-:[&:has([role=checkbox])]:pr-0 oa-:[&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      className={cn(
        'oa-:mt-4 oa-:text-muted-foreground oa-:text-sm',
        className
      )}
      data-slot="table-caption"
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
