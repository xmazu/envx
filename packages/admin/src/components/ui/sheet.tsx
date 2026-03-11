'use client';

import { XIcon } from 'lucide-react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        'oa-:data-[state=closed]:fade-out-0 oa-:data-[state=open]:fade-in-0 oa-:fixed oa-:inset-0 oa-:z-50 oa-:bg-black/50 oa-:data-[state=closed]:animate-out oa-:data-[state=open]:animate-in',
        className
      )}
      data-slot="sheet-overlay"
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          'oa-:fixed oa-:z-50 oa-:flex oa-:flex-col oa-:gap-4 oa-:bg-background oa-:shadow-lg oa-:transition oa-:ease-in-out oa-:data-[state=closed]:animate-out oa-:data-[state=open]:animate-in oa-:data-[state=closed]:duration-300 oa-:data-[state=open]:duration-500',
          side === 'right' &&
            'oa-:data-[state=closed]:slide-out-to-right oa-:data-[state=open]:slide-in-from-right oa-:inset-y-0 oa-:right-0 oa-:h-full oa-:w-3/4 oa-:border-l oa-:sm:max-w-sm',
          side === 'left' &&
            'oa-:data-[state=closed]:slide-out-to-left oa-:data-[state=open]:slide-in-from-left oa-:inset-y-0 oa-:left-0 oa-:h-full oa-:w-3/4 oa-:border-r oa-:sm:max-w-sm',
          side === 'top' &&
            'oa-:data-[state=closed]:slide-out-to-top oa-:data-[state=open]:slide-in-from-top oa-:inset-x-0 oa-:top-0 oa-:h-auto oa-:border-b',
          side === 'bottom' &&
            'oa-:data-[state=closed]:slide-out-to-bottom oa-:data-[state=open]:slide-in-from-bottom oa-:inset-x-0 oa-:bottom-0 oa-:h-auto oa-:border-t',
          className
        )}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close className="oa-:absolute oa-:top-4 oa-:right-4 oa-:rounded-xs oa-:opacity-70 oa-:ring-offset-background oa-:transition-opacity oa-:hover:opacity-100 oa-:focus:outline-hidden oa-:focus:ring-2 oa-:focus:ring-ring oa-:focus:ring-offset-2 oa-:disabled:pointer-events-none oa-:data-[state=open]:bg-secondary">
            <XIcon className="oa-:size-4" />
            <span className="oa-:sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('oa-:flex oa-:flex-col oa-:gap-1.5 oa-:p-4', className)}
      data-slot="sheet-header"
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'oa-:mt-auto oa-:flex oa-:flex-col oa-:gap-2 oa-:p-4',
        className
      )}
      data-slot="sheet-footer"
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn('oa-:font-semibold oa-:text-foreground', className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn('oa-:text-muted-foreground oa-:text-sm', className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
