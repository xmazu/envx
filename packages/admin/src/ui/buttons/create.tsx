'use client';

import { Plus } from 'lucide-react';
import React from 'react';
import { useCreateButton } from '@/hooks';
import type { BaseKey } from '@/types';
import { Button } from '@/ui/shadcn/button';

type CreateButtonProps = {
  /**
   * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
   * @default Inferred resource name from the route
   */
  resource?: BaseKey;
  /**
   * Access Control configuration for the button
   * @default `{ enabled: true, hideIfUnauthorized: false }`
   */
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  /**
   * `meta` property is used when creating the URL for the related action and path.
   */
  meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;

export const CreateButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  CreateButtonProps
>(({ resource, accessControl, meta, children, onClick, ...rest }, ref) => {
  const { hidden, disabled, LinkComponent, to, label } = useCreateButton({
    resource,
    accessControl,
    meta,
  });

  const isDisabled = disabled || rest.disabled;
  const isHidden = hidden || rest.hidden;

  if (isHidden) {
    return null;
  }

  if (!to) {
    return null;
  }

  return (
    <Button {...rest} asChild disabled={isDisabled} ref={ref}>
      <LinkComponent
        href={to}
        onClick={(e: React.MouseEvent) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            e.preventDefault();
            onClick(e as unknown as React.PointerEvent<HTMLButtonElement>);
          }
        }}
      >
        {children ?? (
          <div className="flex items-center gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            <span>{label ?? 'Create'}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

CreateButton.displayName = 'CreateButton';
