import { useGetIdentity } from '@refinedev/core';
import { UserAvatar } from '@/components/refine-ui/layout/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: string;
};

export function UserInfo() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading || !user) {
    return (
      <div className={cn('oa-:flex', 'oa-:items-center', 'oa-:gap-x-2')}>
        <Skeleton className={cn('oa-:h-10', 'oa-:w-10', 'oa-:rounded-full')} />
        <div
          className={cn(
            'oa-:flex',
            'oa-:flex-col',
            'oa-:justify-between',
            'oa-:h-10'
          )}
        >
          <Skeleton className={cn('oa-:h-4', 'oa-:w-32')} />
          <Skeleton className={cn('oa-:h-4', 'oa-:w-24')} />
        </div>
      </div>
    );
  }

  const { firstName, lastName, email } = user;

  return (
    <div className={cn('oa-:flex', 'oa-:items-center', 'oa-:gap-x-2')}>
      <UserAvatar />
      <div
        className={cn(
          'oa-:flex',
          'oa-:flex-col',
          'oa-:justify-between',
          'oa-:h-10',
          'oa-:text-left'
        )}
      >
        <span
          className={cn(
            'oa-:text-sm',
            'oa-:font-medium',
            'oa-:text-muted-foreground'
          )}
        >
          {firstName} {lastName}
        </span>
        <span className={cn('oa-:text-xs', 'oa-:text-muted-foreground')}>
          {email}
        </span>
      </div>
    </div>
  );
}

UserInfo.displayName = 'UserInfo';
