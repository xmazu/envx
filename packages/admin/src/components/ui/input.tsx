import type * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'oa-:h-9 oa-:w-full oa-:min-w-0 oa-:rounded-md oa-:border oa-:border-input oa-:bg-transparent oa-:px-3 oa-:py-1 oa-:text-base oa-:shadow-xs oa-:outline-none oa-:transition-[color,box-shadow] oa-:selection:bg-primary oa-:selection:text-primary-foreground oa-:file:inline-flex oa-:file:h-7 oa-:file:border-0 oa-:file:bg-transparent oa-:file:font-medium oa-:file:text-foreground oa-:file:text-sm oa-:placeholder:text-muted-foreground oa-:disabled:pointer-events-none oa-:disabled:cursor-not-allowed oa-:disabled:opacity-50 oa-:md:text-sm oa-:dark:bg-input/30',
        'oa-:focus-visible:border-ring oa-:focus-visible:ring-[3px] oa-:focus-visible:ring-ring/50',
        'oa-:aria-invalid:border-destructive oa-:aria-invalid:ring-destructive/20 oa-:dark:aria-invalid:ring-destructive/40',
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
