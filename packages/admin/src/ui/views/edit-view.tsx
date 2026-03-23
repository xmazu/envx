'use client';

import { ArrowLeftIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useBack, useResourceParams, useUserFriendlyName } from '@/hooks';
import { cn } from '@/lib/utils';
import { RefreshButton } from '@/ui/buttons/refresh';
import { Breadcrumb } from '@/ui/layout/breadcrumb';
import { Button } from '@/ui/shadcn/button';
import { Separator } from '@/ui/shadcn/separator';

type EditViewProps = PropsWithChildren<{
  className?: string;
}>;

export function EditView({ children, className }: EditViewProps) {
  return (
    <div className={cn('flex flex-col', 'gap-4', className)}>{children}</div>
  );
}

type EditViewHeaderProps = PropsWithChildren<{
  resource?: string;
  title?: string;
  wrapperClassName?: string;
  headerClassName?: string;
  actionsSlot?: React.ReactNode;
}>;

export const EditViewHeader = ({
  resource: resourceFromProps,
  title: titleFromProps,
  actionsSlot,
  wrapperClassName,
  headerClassName,
}: EditViewHeaderProps) => {
  const back = useBack();

  const getUserFriendlyName = useUserFriendlyName();

  const { resource, identifier } = useResourceParams({
    resource: resourceFromProps,
  });
  const { id: recordItemId } = useResourceParams();

  const resourceName = resource?.name ?? identifier;

  const title =
    titleFromProps ??
    getUserFriendlyName(
      resource?.meta?.label ?? identifier ?? resource?.name,
      'plural'
    );

  return (
    <div className={cn('flex flex-col', 'gap-4', wrapperClassName)}>
      <div className="relative flex items-center gap-2">
        <div className="z-[2] bg-background pr-4">
          <Breadcrumb />
        </div>
        <Separator className={cn('absolute', 'left-0', 'right-0', 'z-[1]')} />
      </div>
      <div
        className={cn(
          'flex',
          'gap-1',
          'items-center',
          'justify-between',
          '-ml-2.5',
          headerClassName
        )}
      >
        <div className="flex items-center gap-1">
          <Button onClick={back} size="icon" variant="ghost">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h2 className="font-bold text-2xl">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {actionsSlot}
          <RefreshButton
            recordItemId={recordItemId}
            resource={resourceName}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
};

EditView.displayName = 'EditView';
