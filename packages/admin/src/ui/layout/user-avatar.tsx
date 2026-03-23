import { useGetIdentity } from '@/hooks';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/shadcn/avatar';
import { Skeleton } from '@/ui/shadcn/skeleton';

interface User {
  avatar?: string;
  email: string;
  firstName: string;
  fullName: string;
  id: number;
  lastName: string;
}

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading || !user) {
    return <Skeleton className={cn('h-10', 'w-10', 'rounded-full')} />;
  }

  const { fullName, avatar } = user;

  return (
    <Avatar className={cn('h-10', 'w-10')}>
      {avatar && <AvatarImage alt={fullName} src={avatar} />}
      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
    </Avatar>
  );
}

const getInitials = (name = '') => {
  const names = name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[0].substring(0, 1).toUpperCase();
  }
  return initials;
};

UserAvatar.displayName = 'UserAvatar';
