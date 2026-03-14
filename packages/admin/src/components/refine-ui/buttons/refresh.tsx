'use client';

import { type BaseKey, useRefreshButton } from '@refinedev/core';
import { RefreshCcw } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type RefreshButtonProps = {
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
   * Target data provider name for API call to be made
   * @default `"default"`
   */
  dataProviderName?: string;
  /**
   * `meta` property is used when creating the URL for the related action and path.
   */
  meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;

export const RefreshButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  RefreshButtonProps
>(
  (
    { resource, recordItemId, dataProviderName, meta, children, ...rest },
    ref
  ) => {
    const {
      onClick: refresh,
      loading,
      label,
    } = useRefreshButton({
      resource,
      id: recordItemId,
      dataProviderName,
      meta,
    });

    const isDisabled = rest.disabled || loading;

    return (
      <Button
        onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          refresh();
        }}
        {...rest}
        disabled={isDisabled}
        ref={ref}
      >
        {children ?? (
          <div className="oa-:flex oa-:items-center oa-:gap-2">
            <RefreshCcw
              className={cn('oa-:h-4 oa-:w-4', {
                'animate-spin': loading,
              })}
            />
            <span>{label ?? 'Refresh'}</span>
          </div>
        )}
      </Button>
    );
  }
);

RefreshButton.displayName = 'RefreshButton';
