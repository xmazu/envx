'use client';

import { useLink, useMenu, useRefineOptions } from '@refinedev/core';
import { ChevronRight, ListIcon } from 'lucide-react';
import type React from 'react';

// TreeMenuItem type definition - matches @refinedev/core useMenu hook
type TreeMenuItem = {
  key?: string;
  name: string;
  label?: string;
  route?: string;
  icon?: React.ReactNode;
  meta?: {
    group?: boolean;
    label?: string;
    icon?: React.ReactNode;
  };
  children: TreeMenuItem[];
};

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarRail as ShadcnSidebarRail,
  SidebarTrigger as ShadcnSidebarTrigger,
  useSidebar as useShadcnSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { open } = useShadcnSidebar();
  const { menuItems, selectedKey } = useMenu();

  return (
    <ShadcnSidebar className={cn('oa-:border-none')} collapsible="icon">
      <ShadcnSidebarRail />
      <SidebarHeader />
      <ShadcnSidebarContent
        className={cn(
          'oa-:transition-discrete',
          'oa-:duration-200',
          'oa-:flex',
          'oa-:flex-col',
          'oa-:gap-2',
          'oa-:pt-2',
          'oa-:pb-2',
          'oa-:border-r',
          'oa-:border-border',
          {
            'px-3': open,
            'px-1': !open,
          }
        )}
      >
        {menuItems.map((item: TreeMenuItem) => (
          <SidebarItem
            item={item}
            key={item.key || item.name}
            selectedKey={selectedKey}
          />
        ))}
      </ShadcnSidebarContent>
    </ShadcnSidebar>
  );
}

type MenuItemProps = {
  item: TreeMenuItem;
  selectedKey?: string;
};

function SidebarItem({ item, selectedKey }: MenuItemProps) {
  const { open } = useShadcnSidebar();

  if (item.meta?.group) {
    return <SidebarItemGroup item={item} selectedKey={selectedKey} />;
  }

  if (item.children && item.children.length > 0) {
    if (open) {
      return <SidebarItemCollapsible item={item} selectedKey={selectedKey} />;
    }
    return <SidebarItemDropdown item={item} selectedKey={selectedKey} />;
  }

  return <SidebarItemLink item={item} selectedKey={selectedKey} />;
}

function SidebarItemGroup({ item, selectedKey }: MenuItemProps) {
  const { children } = item;
  const { open } = useShadcnSidebar();

  return (
    <div
      className={cn('oa-:border-t', 'oa-:border-sidebar-border', 'oa-:pt-4')}
    >
      <span
        className={cn(
          'oa-:ml-3',
          'oa-:block',
          'oa-:text-xs',
          'oa-:font-semibold',
          'oa-:uppercase',
          'oa-:text-muted-foreground',
          'oa-:transition-all',
          'oa-:duration-200',
          {
            'h-8': open,
            'h-0': !open,
            'opacity-0': !open,
            'opacity-100': open,
            'pointer-events-none': !open,
            'pointer-events-auto': open,
          }
        )}
      >
        {getDisplayName(item)}
      </span>
      {children && children.length > 0 && (
        <div className={cn('oa-:flex', 'oa-:flex-col')}>
          {children.map((child: TreeMenuItem) => (
            <SidebarItem
              item={child}
              key={child.key || child.name}
              selectedKey={selectedKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarItemCollapsible({ item, selectedKey }: MenuItemProps) {
  const { name, children } = item;

  const chevronIcon = (
    <ChevronRight
      className={cn(
        'oa-:h-4',
        'oa-:w-4',
        'oa-:shrink-0',
        'oa-:text-muted-foreground',
        'oa-:transition-transform',
        'oa-:duration-200',
        'oa-:group-data-[state=open]:rotate-90'
      )}
    />
  );

  return (
    <Collapsible
      className={cn('oa-:w-full', 'oa-:group')}
      key={`collapsible-${name}`}
    >
      <CollapsibleTrigger asChild>
        <SidebarButton item={item} rightIcon={chevronIcon} />
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn('oa-:ml-6', 'oa-:flex', 'oa-:flex-col', 'oa-:gap-2')}
      >
        {children?.map((child: TreeMenuItem) => (
          <SidebarItem
            item={child}
            key={child.key || child.name}
            selectedKey={selectedKey}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarItemDropdown({ item, selectedKey }: MenuItemProps) {
  const { children } = item;
  const Link = useLink();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarButton item={item} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right">
        {children?.map((child: TreeMenuItem) => {
          const { key: childKey } = child;
          const isSelected = childKey === selectedKey;

          return (
            <DropdownMenuItem asChild key={childKey || child.name}>
              <Link
                className={cn(
                  'oa-:flex oa-:w-full oa-:items-center oa-:gap-2',
                  {
                    'bg-accent text-accent-foreground': isSelected,
                  }
                )}
                to={child.route || ''}
              >
                <ItemIcon
                  icon={child.meta?.icon ?? child.icon}
                  isSelected={isSelected}
                />
                <span>{getDisplayName(child)}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarItemLink({ item, selectedKey }: MenuItemProps) {
  const isSelected = item.key === selectedKey;

  return <SidebarButton asLink={true} isSelected={isSelected} item={item} />;
}

function SidebarHeader() {
  const { title } = useRefineOptions();
  const { open, isMobile } = useShadcnSidebar();

  return (
    <ShadcnSidebarHeader
      className={cn(
        'oa-:p-0',
        'oa-:h-16',
        'oa-:border-b',
        'oa-:border-border',
        'oa-:flex-row',
        'oa-:items-center',
        'oa-:justify-between',
        'oa-:overflow-hidden'
      )}
    >
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

      <ShadcnSidebarTrigger
        className={cn('oa-:text-muted-foreground', 'oa-:mr-1.5', {
          'opacity-0': !open,
          'opacity-100': open || isMobile,
          'pointer-events-auto': open || isMobile,
          'pointer-events-none': !(open || isMobile),
        })}
      />
    </ShadcnSidebarHeader>
  );
}

function getDisplayName(item: TreeMenuItem) {
  return item.meta?.label ?? item.label ?? item.name;
}

type IconProps = {
  icon: React.ReactNode;
  isSelected?: boolean;
};

function ItemIcon({ icon, isSelected }: IconProps) {
  return (
    <div
      className={cn('oa-:w-4', {
        'text-muted-foreground': !isSelected,
        'text-sidebar-primary-foreground': isSelected,
      })}
    >
      {icon ?? <ListIcon />}
    </div>
  );
}

type SidebarButtonProps = React.ComponentProps<typeof Button> & {
  item: TreeMenuItem;
  isSelected?: boolean;
  rightIcon?: React.ReactNode;
  asLink?: boolean;
  onClick?: () => void;
};

function SidebarButton({
  item,
  isSelected = false,
  rightIcon,
  asLink = false,
  className,
  onClick,
  ...props
}: SidebarButtonProps) {
  const Link = useLink();

  const buttonContent = (
    <>
      <ItemIcon icon={item.meta?.icon ?? item.icon} isSelected={isSelected} />
      <span
        className={cn('oa-:tracking-[-0.00875rem]', {
          'flex-1': rightIcon,
          'text-left': rightIcon,
          'line-clamp-1': !rightIcon,
          truncate: !rightIcon,
          'font-normal': !isSelected,
          'font-semibold': isSelected,
          'text-sidebar-primary-foreground': isSelected,
          'text-foreground': !isSelected,
        })}
      >
        {getDisplayName(item)}
      </span>
      {rightIcon}
    </>
  );

  return (
    <Button
      asChild={!!(asLink && item.route)}
      className={cn(
        'oa-:!px-3 oa-:flex oa-:w-full oa-:items-center oa-:justify-start oa-:gap-2 oa-:py-2 oa-:text-sm',
        {
          'bg-sidebar-primary': isSelected,
          'hover:!bg-sidebar-primary/90': isSelected,
          'text-sidebar-primary-foreground': isSelected,
          'hover:text-sidebar-primary-foreground': isSelected,
        },
        className
      )}
      onClick={onClick}
      size="lg"
      variant="ghost"
      {...props}
    >
      {asLink && item.route ? (
        <Link
          className={cn('oa-:flex oa-:w-full oa-:items-center oa-:gap-2')}
          to={item.route}
        >
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}
    </Button>
  );
}

Sidebar.displayName = 'Sidebar';
