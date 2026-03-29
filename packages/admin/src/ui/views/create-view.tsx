'use client';

import { ArrowLeftIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useBack, useResourceParams, useUserFriendlyName } from '@/hooks';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/ui/layout/breadcrumb';
import { Button } from '@/ui/shadcn/button';
import { Separator } from '@/ui/shadcn/separator';

type CreateViewProps = PropsWithChildren<{
  className?: string;
}>;

export function CreateView({ children, className }: CreateViewProps) {
  return (
    <div className={cn('flex flex-col', 'gap-4', className)}>{children}</div>
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

  const { resource } = useResourceParams({
    resource: resourceFromProps,
  });

  const title =
    titleFromProps ??
    getUserFriendlyName(resource?.meta?.label ?? resource?.name, 'plural');

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
          '-ml-2.5',
          headerClassName
        )}
      >
        <Button onClick={back} size="icon" variant="ghost">
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h2 className="font-bold text-2xl">{title}</h2>
      </div>
    </div>
  );
};
