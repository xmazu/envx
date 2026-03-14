'use client';

import {
  useBack,
  useResourceParams,
  useUserFriendlyName,
} from '@refinedev/core';
import { ArrowLeftIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type CreateViewProps = PropsWithChildren<{
  className?: string;
}>;

export function CreateView({ children, className }: CreateViewProps) {
  return (
    <div className={cn('oa-:flex oa-:flex-col', 'oa-:gap-4', className)}>
      {children}
    </div>
  );
}

type CreateHeaderProps = PropsWithChildren<{
  resource?: string;
  title?: string;
  wrapperClassName?: string;
  headerClassName?: string;
}>;

export const CreateViewHeader = ({
  resource: resourceFromProps,
  title: titleFromProps,
  wrapperClassName,
  headerClassName,
}: CreateHeaderProps) => {
  const back = useBack();

  const getUserFriendlyName = useUserFriendlyName();

  const { resource, identifier } = useResourceParams({
    resource: resourceFromProps,
  });

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
          'oa-:gap-1',
          'oa-:items-center',
          'oa-:-ml-2.5',
          headerClassName
        )}
      >
        <Button onClick={back} size="icon" variant="ghost">
          <ArrowLeftIcon className="oa-:h-4 oa-:w-4" />
        </Button>
        <h2 className="oa-:font-bold oa-:text-2xl">{title}</h2>
      </div>
    </div>
  );
};

CreateView.displayName = 'CreateView';
