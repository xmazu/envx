import {
  useActiveAuthProvider,
  useLogout,
  useRefineOptions,
} from '@refinedev/core';
import { LogOutIcon } from 'lucide-react';
import { UserAvatar } from '@/components/refine-ui/layout/user-avatar';
import { ThemeToggle } from '@/components/refine-ui/theme/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

function DesktopHeader() {
  return (
    <header
      className={cn(
        'oa-:sticky',
        'oa-:top-0',
        'oa-:flex',
        'oa-:h-16',
        'oa-:shrink-0',
        'oa-:items-center',
        'oa-:gap-4',
        'oa-:border-b',
        'oa-:border-border',
        'oa-:bg-sidebar',
        'oa-:pr-3',
        'oa-:justify-end',
        'oa-:z-40'
      )}
    >
      <ThemeToggle />
      <UserDropdown />
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

  const { title } = useRefineOptions();

  return (
    <header
      className={cn(
        'oa-:sticky',
        'oa-:top-0',
        'oa-:flex',
        'oa-:h-12',
        'oa-:shrink-0',
        'oa-:items-center',
        'oa-:gap-2',
        'oa-:border-b',
        'oa-:border-border',
        'oa-:bg-sidebar',
        'oa-:pr-3',
        'oa-:justify-between',
        'oa-:z-40'
      )}
    >
      <SidebarTrigger
        className={cn(
          'oa-:text-muted-foreground',
          'oa-:rotate-180',
          'oa-:ml-1',
          {
            'opacity-0': open,
            'opacity-100': !open || isMobile,
            'pointer-events-auto': !open || isMobile,
            'pointer-events-none': open && !isMobile,
          }
        )}
      />

      <div
        className={cn(
          'oa-:whitespace-nowrap',
          'oa-:flex',
          'oa-:flex-row',
          'oa-:h-full',
          'oa-:items-center',
          'oa-:justify-start',
          'oa-:gap-2',
          'oa-:transition-discrete',
          'oa-:duration-200',
          {
            'pl-3': !open,
            'pl-5': open,
          }
        )}
      >
        <div>{title.icon}</div>
        <h2
          className={cn(
            'oa-:text-sm',
            'oa-:font-bold',
            'oa-:transition-opacity',
            'oa-:duration-200',
            {
              'opacity-0': !open,
              'opacity-100': open,
            }
          )}
        >
          {title.text}
        </h2>
      </div>

      <ThemeToggle className={cn('oa-:h-8', 'oa-:w-8')} />
    </header>
  );
}

const UserDropdown = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const authProvider = useActiveAuthProvider();

  if (!authProvider?.getIdentity) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <LogOutIcon
            className={cn('oa-:text-destructive', 'oa-:hover:text-destructive')}
          />
          <span
            className={cn('oa-:text-destructive', 'oa-:hover:text-destructive')}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Header.displayName = 'Header';
MobileHeader.displayName = 'MobileHeader';
DesktopHeader.displayName = 'DesktopHeader';
