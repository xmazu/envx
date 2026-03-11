'use client';

import {
  useBack,
  useResourceParams,
  useUserFriendlyName,
} from '@refinedev/core';

import { ArrowLeftIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { RefreshButton } from '@/components/refine-ui/buttons/refresh';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { EditButton } from '../buttons/edit';

type ShowViewProps = PropsWithChildren<{
  className?: string;
}>;

export function ShowView({ children, className }: ShowViewProps) {
  return (
    <div className={cn('oa-:flex oa-:flex-col', 'oa-:gap-4', className)}>
      {children}
    </div>
  );
}

type ShowViewHeaderProps = PropsWithChildren<{
  resource?: string;
  title?: string;
  wrapperClassName?: string;
  headerClassName?: string;
}>;

export const ShowViewHeader = ({
  resource: resourceFromProps,
  title: titleFromProps,
  wrapperClassName,
  headerClassName,
}: ShowViewHeaderProps) => {
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
      'singular'
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
          'oa-:gap-1',
          'oa-:items-center',
          'oa-:justify-between',
          'oa-:-ml-2.5',
          headerClassName
        )}
      >
        <div className="oa-:flex oa-:items-center oa-:gap-1">
          <Button onClick={back} size="icon" variant="ghost">
            <ArrowLeftIcon className="oa-:h-4 oa-:w-4" />
          </Button>
          <h2 className="oa-:font-bold oa-:text-2xl">{title}</h2>
        </div>

        <div className="oa-:flex oa-:items-center oa-:gap-2">
          <RefreshButton
            recordItemId={recordItemId}
            resource={resourceName}
            variant="outline"
          />
          <EditButton
            recordItemId={recordItemId}
            resource={resourceName}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
};

ShowView.displayName = 'ShowView';
