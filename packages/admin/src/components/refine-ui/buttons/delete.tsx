'use client';

import { type BaseKey, useDeleteButton } from '@refinedev/core';
import { Loader2, Trash } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DeleteButtonProps = {
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

export const DeleteButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  DeleteButtonProps
>(({ resource, recordItemId, accessControl, meta, children, ...rest }, ref) => {
  const {
    hidden,
    disabled,
    loading,
    onConfirm,
    label,
    confirmTitle: defaultConfirmTitle,
    confirmOkLabel: defaultConfirmOkLabel,
    cancelLabel: defaultCancelLabel,
  } = useDeleteButton({
    resource,
    id: recordItemId,
    accessControl,
    meta,
  });
  const [open, setOpen] = React.useState(false);

  const isDisabled = disabled || rest.disabled || loading;
  const isHidden = hidden || rest.hidden;

  if (isHidden) {
    return null;
  }

  const confirmCancelText = defaultCancelLabel;
  const confirmOkText = defaultConfirmOkLabel;
  const confirmTitle = defaultConfirmTitle;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <span>
          <Button
            variant="destructive"
            {...rest}
            disabled={isDisabled}
            ref={ref}
          >
            {loading && (
              <Loader2 className="oa-:mr-2 oa-:h-4 oa-:w-4 oa-:animate-spin" />
            )}
            {children ?? (
              <div className="oa-:flex oa-:items-center oa-:gap-2 oa-:font-semibold">
                <Trash className="oa-:h-4 oa-:w-4" />
                <span>{label}</span>
              </div>
            )}
          </Button>
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="oa-:w-auto">
        <div className="oa-:flex oa-:flex-col oa-:gap-2">
          <p className="oa-:text-sm">{confirmTitle}</p>
          <div className="oa-:flex oa-:justify-end oa-:gap-2">
            <Button onClick={() => setOpen(false)} size="sm" variant="outline">
              {confirmCancelText}
            </Button>
            <Button
              disabled={loading}
              onClick={() => {
                if (typeof onConfirm === 'function') {
                  onConfirm();
                }
                setOpen(false);
              }}
              size="sm"
              variant="destructive"
            >
              {confirmOkText}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

DeleteButton.displayName = 'DeleteButton';
