'use client';

import { Tooltip as TooltipPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          'oa-:fade-in-0 oa-:zoom-in-95 oa-:data-[side=bottom]:slide-in-from-top-2 oa-:data-[side=left]:slide-in-from-right-2 oa-:data-[side=right]:slide-in-from-left-2 oa-:data-[side=top]:slide-in-from-bottom-2 oa-:data-[state=closed]:fade-out-0 oa-:data-[state=closed]:zoom-out-95 oa-:z-50 oa-:w-fit oa-:origin-(--radix-tooltip-content-transform-origin) oa-:animate-in oa-:text-balance oa-:rounded-md oa-:bg-foreground oa-:px-3 oa-:py-1.5 oa-:text-background oa-:text-xs oa-:data-[state=closed]:animate-out',
          className
        )}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="oa-:z-50 oa-:size-2.5 oa-:translate-y-[calc(-50%_-_2px)] oa-:rotate-45 oa-:rounded-[2px] oa-:bg-foreground oa-:fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
