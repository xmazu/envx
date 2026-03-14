'use client';

import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import type * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'oa-:data-[state=closed]:fade-out-0 oa-:data-[state=open]:fade-in-0 oa-:fixed oa-:inset-0 oa-:z-50 oa-:bg-black/50 oa-:data-[state=closed]:animate-out oa-:data-[state=open]:animate-in',
        className
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'oa-:data-[state=closed]:fade-out-0 oa-:data-[state=closed]:zoom-out-95 oa-:data-[state=open]:fade-in-0 oa-:data-[state=open]:zoom-in-95 oa-:fixed oa-:top-[50%] oa-:left-[50%] oa-:z-50 oa-:grid oa-:w-full oa-:max-w-[calc(100%-2rem)] oa-:translate-x-[-50%] oa-:translate-y-[-50%] oa-:gap-4 oa-:rounded-lg oa-:border oa-:bg-background oa-:p-6 oa-:shadow-lg oa-:outline-none oa-:duration-200 oa-:data-[state=closed]:animate-out oa-:data-[state=open]:animate-in oa-:sm:max-w-lg',
          className
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className="oa-:absolute oa-:top-4 oa-:right-4 oa-:rounded-xs oa-:opacity-70 oa-:ring-offset-background oa-:transition-opacity oa-:hover:opacity-100 oa-:focus:outline-hidden oa-:focus:ring-2 oa-:focus:ring-ring oa-:focus:ring-offset-2 oa-:disabled:pointer-events-none oa-:data-[state=open]:bg-accent oa-:data-[state=open]:text-muted-foreground oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0"
            data-slot="dialog-close"
          >
            <XIcon />
            <span className="oa-:sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'oa-:flex oa-:flex-col oa-:gap-2 oa-:text-center oa-:sm:text-left',
        className
      )}
      data-slot="dialog-header"
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      className={cn(
        'oa-:flex oa-:flex-col-reverse oa-:gap-2 oa-:sm:flex-row oa-:sm:justify-end',
        className
      )}
      data-slot="dialog-footer"
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'oa-:font-semibold oa-:text-lg oa-:leading-none',
        className
      )}
      data-slot="dialog-title"
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('oa-:text-muted-foreground oa-:text-sm', className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
