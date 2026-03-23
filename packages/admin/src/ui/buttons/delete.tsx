'use client';

import { Loader2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDataProvider } from '@/hooks';
import { Button } from '@/ui/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/shadcn/popover';

type DeleteButtonProps = {
  resource: string;
  recordItemId: string;
} & React.ComponentProps<typeof Button>;

export const DeleteButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  DeleteButtonProps
>(({ resource, recordItemId, children, ...rest }, ref) => {
  const dataProvider = useDataProvider();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dataProvider.deleteOne({
        resource,
        id: recordItemId,
      });
      setOpen(false);
      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = rest.disabled || loading;

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
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children ?? (
              <div className="flex items-center gap-2 font-semibold">
                <Trash className="h-4 w-4" />
                <span>Delete</span>
              </div>
            )}
          </Button>
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            Are you sure you want to delete this record?
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={handleDelete}
              size="sm"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

DeleteButton.displayName = 'DeleteButton';
