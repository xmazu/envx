'use client';

import { type BaseKey, useEditButton } from '@refinedev/core';
import { Pencil } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

type EditButtonProps = {
  /**
   * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
   * @default Inferred resource name from the route
   */
  resource?: string;
  /**
   * Data item identifier for the actions with the API
   * @default Reads `:id` from the URL
   */
  recordItemId?: BaseKey;
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

export const EditButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  EditButtonProps
>(
  (
    { resource, recordItemId, accessControl, meta, children, onClick, ...rest },
    ref
  ) => {
    const { hidden, disabled, LinkComponent, to, label } = useEditButton({
      resource,
      id: recordItemId,
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
              <Pencil className="oa-:h-4 oa-:w-4" />
              <span>{label}</span>
            </div>
          )}
        </LinkComponent>
      </Button>
    );
  }
);

EditButton.displayName = 'EditButton';
