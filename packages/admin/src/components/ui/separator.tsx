'use client';

import { Separator as SeparatorPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        'oa-:shrink-0 oa-:bg-border oa-:data-[orientation=horizontal]:h-px oa-:data-[orientation=vertical]:h-full oa-:data-[orientation=horizontal]:w-full oa-:data-[orientation=vertical]:w-px',
        className
      )}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
