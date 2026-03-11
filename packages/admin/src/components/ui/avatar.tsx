'use client';

import { Avatar as AvatarPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function Avatar({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'default' | 'sm' | 'lg';
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'oa-:group/avatar oa-:relative oa-:flex oa-:size-8 oa-:shrink-0 oa-:select-none oa-:overflow-hidden oa-:rounded-full oa-:data-[size=lg]:size-10 oa-:data-[size=sm]:size-6',
        className
      )}
      data-size={size}
      data-slot="avatar"
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn('oa-:aspect-square oa-:size-full', className)}
      data-slot="avatar-image"
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'oa-:flex oa-:size-full oa-:items-center oa-:justify-center oa-:rounded-full oa-:bg-muted oa-:text-muted-foreground oa-:text-sm oa-:group-data-[size=sm]/avatar:text-xs',
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'oa-:absolute oa-:right-0 oa-:bottom-0 oa-:z-10 oa-:inline-flex oa-:select-none oa-:items-center oa-:justify-center oa-:rounded-full oa-:bg-primary oa-:text-primary-foreground oa-:ring-2 oa-:ring-background',
        'oa-:group-data-[size=sm]/avatar:size-2 oa-:group-data-[size=sm]/avatar:[&>svg]:hidden',
        'oa-:group-data-[size=default]/avatar:size-2.5 oa-:group-data-[size=default]/avatar:[&>svg]:size-2',
        'oa-:group-data-[size=lg]/avatar:size-3 oa-:group-data-[size=lg]/avatar:[&>svg]:size-2',
        className
      )}
      data-slot="avatar-badge"
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'oa-:group/avatar-group oa-:flex oa-:-space-x-2 oa-:*:data-[slot=avatar]:ring-2 oa-:*:data-[slot=avatar]:ring-background',
        className
      )}
      data-slot="avatar-group"
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'oa-:relative oa-:flex oa-:size-8 oa-:shrink-0 oa-:items-center oa-:justify-center oa-:rounded-full oa-:bg-muted oa-:text-muted-foreground oa-:text-sm oa-:ring-2 oa-:ring-background oa-:group-has-data-[size=lg]/avatar-group:size-10 oa-:group-has-data-[size=sm]/avatar-group:size-6 oa-:[&>svg]:size-4 oa-:group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 oa-:group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        className
      )}
      data-slot="avatar-group-count"
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
