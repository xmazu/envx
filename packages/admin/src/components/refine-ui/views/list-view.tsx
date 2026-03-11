'use client';

import { useResourceParams, useUserFriendlyName } from '@refinedev/core';
import type { PropsWithChildren } from 'react';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type ListViewProps = PropsWithChildren<{
  className?: string;
}>;

export function ListView({ children, className }: ListViewProps) {
  return (
    <div className={cn('oa-:flex oa-:flex-col', 'oa-:gap-4', className)}>
      {children}
    </div>
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
    <div className={cn('oa-:flex oa-:flex-col', 'oa-:gap-4', wrapperClassName)}>
      <div className="oa-:relative oa-:flex oa-:items-center oa-:gap-2">
        <div className="oa-:z-[2] oa-:bg-background oa-:pr-4">
          <Breadcrumb />
        </div>
        <Separator
          className={cn(
            'oa-:absolute',
            'oa-:left-0',
            'oa-:right-0',
            'oa-:z-[1]'
          )}
        />
      </div>
      <div
        className={cn(
          'oa-:flex',
          'oa-:justify-between',
          'oa-:gap-4',
          headerClassName
        )}
      >
        <h2 className="oa-:font-bold oa-:text-2xl">{title}</h2>
        {isCreateButtonVisible && (
          <div className="oa-:flex oa-:items-center oa-:gap-2">
            <CreateButton resource={resourceName} />
          </div>
        )}
      </div>
    </div>
  );
};

ListView.displayName = 'ListView';
