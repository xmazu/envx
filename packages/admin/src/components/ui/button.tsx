import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'oa-:inline-flex oa-:shrink-0 oa-:items-center oa-:justify-center oa-:gap-2 oa-:whitespace-nowrap oa-:rounded-md oa-:font-medium oa-:text-sm oa-:outline-none oa-:transition-all oa-:focus-visible:border-ring oa-:focus-visible:ring-[3px] oa-:focus-visible:ring-ring/50 oa-:disabled:pointer-events-none oa-:disabled:opacity-50 oa-:aria-invalid:border-destructive oa-:aria-invalid:ring-destructive/20 oa-:dark:aria-invalid:ring-destructive/40 oa-:[&_svg:not([class*=size-])]:size-4 oa-:[&_svg]:pointer-events-none oa-:[&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'oa-:bg-primary oa-:text-primary-foreground oa-:hover:bg-primary/90',
        destructive:
          'oa-:bg-destructive oa-:text-white oa-:hover:bg-destructive/90 oa-:focus-visible:ring-destructive/20 oa-:dark:bg-destructive/60 oa-:dark:focus-visible:ring-destructive/40',
        outline:
          'oa-:border oa-:bg-background oa-:shadow-xs oa-:hover:bg-accent oa-:hover:text-accent-foreground oa-:dark:border-input oa-:dark:bg-input/30 oa-:dark:hover:bg-input/50',
        secondary:
          'oa-:bg-secondary oa-:text-secondary-foreground oa-:hover:bg-secondary/80',
        ghost:
          'oa-:hover:bg-accent oa-:hover:text-accent-foreground oa-:dark:hover:bg-accent/50',
        link: 'oa-:text-primary oa-:underline-offset-4 oa-:hover:underline',
      },
      size: {
        default: 'oa-:h-9 oa-:px-4 oa-:py-2 oa-:has-[>svg]:px-3',
        xs: 'oa-:h-6 oa-:gap-1 oa-:rounded-md oa-:px-2 oa-:text-xs oa-:has-[>svg]:px-1.5 oa-:[&_svg:not([class*=size-])]:size-3',
        sm: 'oa-:h-8 oa-:gap-1.5 oa-:rounded-md oa-:px-3 oa-:has-[>svg]:px-2.5',
        lg: 'oa-:h-10 oa-:rounded-md oa-:px-6 oa-:has-[>svg]:px-4',
        icon: 'oa-:size-9',
        'icon-xs':
          'oa-:size-6 oa-:rounded-md oa-:[&_svg:not([class*=size-])]:size-3',
        'icon-sm': 'oa-:size-8',
        'icon-lg': 'oa-:size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
    />
  );
}

export { Button, buttonVariants };
