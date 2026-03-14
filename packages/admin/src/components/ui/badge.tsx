import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'oa-:inline-flex oa-:w-fit oa-:shrink-0 oa-:items-center oa-:justify-center oa-:gap-1 oa-:overflow-hidden oa-:whitespace-nowrap oa-:rounded-full oa-:border oa-:border-transparent oa-:px-2 oa-:py-0.5 oa-:font-medium oa-:text-xs oa-:transition-[color,box-shadow] oa-:focus-visible:border-ring oa-:focus-visible:ring-[3px] oa-:focus-visible:ring-ring/50 oa-:aria-invalid:border-destructive oa-:aria-invalid:ring-destructive/20 oa-:dark:aria-invalid:ring-destructive/40 oa-:[&>svg]:pointer-events-none oa-:[&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'oa-:bg-primary oa-:text-primary-foreground oa-:[a&]:hover:bg-primary/90',
        secondary:
          'oa-:bg-secondary oa-:text-secondary-foreground oa-:[a&]:hover:bg-secondary/90',
        destructive:
          'oa-:bg-destructive oa-:text-white oa-:focus-visible:ring-destructive/20 oa-:dark:bg-destructive/60 oa-:dark:focus-visible:ring-destructive/40 oa-:[a&]:hover:bg-destructive/90',
        outline:
          'oa-:border-border oa-:text-foreground oa-:[a&]:hover:bg-accent oa-:[a&]:hover:text-accent-foreground',
        ghost: 'oa-:[a&]:hover:bg-accent oa-:[a&]:hover:text-accent-foreground',
        link: 'oa-:text-primary oa-:underline-offset-4 oa-:[a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      data-slot="badge"
      data-variant={variant}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
