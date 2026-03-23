'use client';

import type { PropsWithChildren } from 'react';
import { useResourceParams, useUserFriendlyName } from '@/hooks';
import { cn } from '@/lib/utils';
import { CreateButton } from '@/ui/buttons/create';
import { Breadcrumb } from '@/ui/layout/breadcrumb';
import { Separator } from '@/ui/shadcn/separator';

type ListViewProps = PropsWithChildren<{
  className?: string;
}>;

export function ListView({ children, className }: ListViewProps) {
  return (
    <div className={cn('flex flex-col', 'gap-4', className)}>{children}</div>
  );
}

type ListHeaderProps = PropsWithChildren<{
  resource?: string;
  title?: string;
  canCreate?: boolean;
  headerClassName?: string;
  wrapperClassName?: string;
}>;

export const ListViewHeader = ({
  canCreate,
  resource: resourceFromProps,
  title: titleFromProps,
  wrapperClassName,
  headerClassName,
}: ListHeaderProps) => {
  const getUserFriendlyName = useUserFriendlyName();

  const { resource, identifier } = useResourceParams({
    resource: resourceFromProps,
  });
  const resourceName = identifier ?? resource?.name;

  const isCreateButtonVisible = canCreate ?? !!resource?.create;

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
      <div className={cn('flex', 'justify-between', 'gap-4', headerClassName)}>
        <h2 className="font-bold text-2xl">{title}</h2>
        {isCreateButtonVisible && (
          <div className="flex items-center gap-2">
            <CreateButton resource={resourceName} />
          </div>
        )}
      </div>
    </div>
  );
};

ListView.displayName = 'ListView';
