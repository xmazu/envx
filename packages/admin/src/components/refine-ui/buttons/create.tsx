'use client';

import { type BaseKey, useCreateButton } from '@refinedev/core';
import { Plus } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

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

  return (
    <Button {...rest} asChild disabled={isDisabled} ref={ref}>
      <LinkComponent
        onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}
        replace={false}
        to={to}
      >
        {children ?? (
          <div className="oa-:flex oa-:items-center oa-:gap-2 oa-:font-semibold">
            <Plus className="oa-:h-4 oa-:w-4" />
            <span>{label ?? 'Create'}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

CreateButton.displayName = 'CreateButton';
