'use client';

import { type BaseKey, useListButton } from '@refinedev/core';
import { List } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

type ListButtonProps = {
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

export const ListButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  ListButtonProps
>(({ resource, accessControl, meta, children, onClick, ...rest }, ref) => {
  const { hidden, disabled, LinkComponent, to, label } = useListButton({
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
            <List className="oa-:h-4 oa-:w-4" />
            <span>{label}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

ListButton.displayName = 'ListButton';
