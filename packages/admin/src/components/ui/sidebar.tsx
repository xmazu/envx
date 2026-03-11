'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { PanelLeftIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            'oa-:group/sidebar-wrapper oa-:flex oa-:min-h-svh oa-:w-full oa-:has-data-[variant=inset]:bg-sidebar',
            className
          )}
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'oa-:flex oa-:h-full oa-:w-(--sidebar-width) oa-:flex-col oa-:bg-sidebar oa-:text-sidebar-foreground',
          className
        )}
        data-slot="sidebar"
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetContent
          className="oa-:w-(--sidebar-width) oa-:bg-sidebar oa-:p-0 oa-:text-sidebar-foreground oa-:[&>button]:hidden"
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          side={side}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <SheetHeader className="oa-:sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="oa-:flex oa-:h-full oa-:w-full oa-:flex-col">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="oa-:group oa-:peer oa-:hidden oa-:text-sidebar-foreground oa-:md:block"
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'oa-:relative oa-:w-(--sidebar-width) oa-:bg-transparent oa-:transition-[width] oa-:duration-200 oa-:ease-linear',
          'oa-:group-data-[collapsible=offcanvas]:w-0',
          'oa-:group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'oa-:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'oa-:group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
        )}
        data-slot="sidebar-gap"
      />
      <div
        className={cn(
          'oa-:fixed oa-:inset-y-0 oa-:z-10 oa-:hidden oa-:h-svh oa-:w-(--sidebar-width) oa-:transition-[left,right,width] oa-:duration-200 oa-:ease-linear oa-:md:flex',
          side === 'left'
            ? 'oa-:left-0 oa-:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'oa-:right-0 oa-:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'oa-:p-2 oa-:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'oa-:group-data-[collapsible=icon]:w-(--sidebar-width-icon) oa-:group-data-[side=left]:border-r oa-:group-data-[side=right]:border-l',
          className
        )}
        data-slot="sidebar-container"
        {...props}
      >
        <div
          className="oa-:flex oa-:h-full oa-:w-full oa-:flex-col oa-:bg-sidebar oa-:group-data-[variant=floating]:rounded-lg oa-:group-data-[variant=floating]:border oa-:group-data-[variant=floating]:border-sidebar-border oa-:group-data-[variant=floating]:shadow-sm"
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className={cn('oa-:size-7', className)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      <PanelLeftIcon />
      <span className="oa-:sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      aria-label="Toggle Sidebar"
      className={cn(
        'oa-:absolute oa-:inset-y-0 oa-:z-20 oa-:hidden oa-:w-4 oa-:-translate-x-1/2 oa-:transition-all oa-:ease-linear oa-:after:absolute oa-:after:inset-y-0 oa-:after:left-1/2 oa-:after:w-[2px] oa-:hover:after:bg-sidebar-border oa-:group-data-[side=left]:-right-4 oa-:group-data-[side=right]:left-0 oa-:sm:flex',
        'oa-:in-data-[side=left]:cursor-w-resize oa-:in-data-[side=right]:cursor-e-resize',
        'oa-:[[data-side=left][data-state=collapsed]_&]:cursor-e-resize oa-:[[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'oa-:group-data-[collapsible=offcanvas]:translate-x-0 oa-:hover:group-data-[collapsible=offcanvas]:bg-sidebar oa-:group-data-[collapsible=offcanvas]:after:left-full',
        'oa-:[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        'oa-:[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title="Toggle Sidebar"
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'oa-:relative oa-:flex oa-:w-full oa-:flex-1 oa-:flex-col oa-:bg-background',
        'oa-:md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 oa-:md:peer-data-[variant=inset]:m-2 oa-:md:peer-data-[variant=inset]:ml-0 oa-:md:peer-data-[variant=inset]:rounded-xl oa-:md:peer-data-[variant=inset]:shadow-sm',
        className
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        'oa-:h-8 oa-:w-full oa-:bg-background oa-:shadow-none',
        className
      )}
      data-sidebar="input"
      data-slot="sidebar-input"
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('oa-:flex oa-:flex-col oa-:gap-2 oa-:p-2', className)}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('oa-:flex oa-:flex-col oa-:gap-2 oa-:p-2', className)}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn('oa-:mx-2 oa-:w-auto oa-:bg-sidebar-border', className)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'oa-:flex oa-:min-h-0 oa-:flex-1 oa-:flex-col oa-:gap-2 oa-:overflow-auto oa-:group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'oa-:relative oa-:flex oa-:w-full oa-:min-w-0 oa-:flex-col oa-:p-2',
        className
      )}
      data-sidebar="group"
      data-slot="sidebar-group"
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      className={cn(
        'oa-:flex oa-:h-8 oa-:shrink-0 oa-:items-center oa-:rounded-md oa-:px-2 oa-:font-medium oa-:text-sidebar-foreground/70 oa-:text-xs oa-:outline-hidden oa-:ring-sidebar-ring oa-:transition-[margin,opacity] oa-:duration-200 oa-:ease-linear oa-:focus-visible:ring-2 oa-:[&>svg]:size-4 oa-:[&>svg]:shrink-0',
        'oa-:group-data-[collapsible=icon]:-mt-8 oa-:group-data-[collapsible=icon]:opacity-0',
        className
      )}
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(
        'oa-:absolute oa-:top-3.5 oa-:right-3 oa-:flex oa-:aspect-square oa-:w-5 oa-:items-center oa-:justify-center oa-:rounded-md oa-:p-0 oa-:text-sidebar-foreground oa-:outline-hidden oa-:ring-sidebar-ring oa-:transition-transform oa-:hover:bg-sidebar-accent oa-:hover:text-sidebar-accent-foreground oa-:focus-visible:ring-2 oa-:[&>svg]:size-4 oa-:[&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'oa-:after:absolute oa-:after:-inset-2 oa-:md:after:hidden',
        'oa-:group-data-[collapsible=icon]:hidden',
        className
      )}
      data-sidebar="group-action"
      data-slot="sidebar-group-action"
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('oa-:w-full oa-:text-sm', className)}
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'oa-:flex oa-:w-full oa-:min-w-0 oa-:flex-col oa-:gap-1',
        className
      )}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('oa-:group/menu-item oa-:relative', className)}
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  'oa-:peer/menu-button oa-:flex oa-:w-full oa-:items-center oa-:gap-2 oa-:overflow-hidden oa-:rounded-md oa-:p-2 oa-:text-left oa-:text-sm oa-:outline-hidden oa-:ring-sidebar-ring oa-:transition-[width,height,padding] oa-:hover:bg-sidebar-accent oa-:hover:text-sidebar-accent-foreground oa-:focus-visible:ring-2 oa-:active:bg-sidebar-accent oa-:active:text-sidebar-accent-foreground oa-:disabled:pointer-events-none oa-:disabled:opacity-50 oa-:group-has-data-[sidebar=menu-action]/menu-item:pr-8 oa-:aria-disabled:pointer-events-none oa-:aria-disabled:opacity-50 oa-:data-[active=true]:bg-sidebar-accent oa-:data-[active=true]:font-medium oa-:data-[active=true]:text-sidebar-accent-foreground oa-:data-[state=open]:hover:bg-sidebar-accent oa-:data-[state=open]:hover:text-sidebar-accent-foreground oa-:group-data-[collapsible=icon]:size-8! oa-:group-data-[collapsible=icon]:p-2! oa-:[&>span:last-child]:truncate oa-:[&>svg]:size-4 oa-:[&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'oa-:hover:bg-sidebar-accent oa-:hover:text-sidebar-accent-foreground',
        outline:
          'oa-:bg-background oa-:shadow-[0_0_0_1px_hsl(var(--sidebar-border))] oa-:hover:bg-sidebar-accent oa-:hover:text-sidebar-accent-foreground oa-:hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'oa-:h-8 oa-:text-sm',
        sm: 'oa-:h-7 oa-:text-xs',
        lg: 'oa-:h-12 oa-:text-sm oa-:group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : 'button';
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      data-active={isActive}
      data-sidebar="menu-button"
      data-size={size}
      data-slot="sidebar-menu-button"
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        side="right"
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(
        'oa-:absolute oa-:top-1.5 oa-:right-1 oa-:flex oa-:aspect-square oa-:w-5 oa-:items-center oa-:justify-center oa-:rounded-md oa-:p-0 oa-:text-sidebar-foreground oa-:outline-hidden oa-:ring-sidebar-ring oa-:transition-transform oa-:hover:bg-sidebar-accent oa-:hover:text-sidebar-accent-foreground oa-:focus-visible:ring-2 oa-:peer-hover/menu-button:text-sidebar-accent-foreground oa-:[&>svg]:size-4 oa-:[&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'oa-:after:absolute oa-:after:-inset-2 oa-:md:after:hidden',
        'oa-:peer-data-[size=sm]/menu-button:top-1',
        'oa-:peer-data-[size=default]/menu-button:top-1.5',
        'oa-:peer-data-[size=lg]/menu-button:top-2.5',
        'oa-:group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'oa-:group-focus-within/menu-item:opacity-100 oa-:group-hover/menu-item:opacity-100 oa-:data-[state=open]:opacity-100 oa-:peer-data-[active=true]/menu-button:text-sidebar-accent-foreground oa-:md:opacity-0',
        className
      )}
      data-sidebar="menu-action"
      data-slot="sidebar-menu-action"
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'oa-:pointer-events-none oa-:absolute oa-:right-1 oa-:flex oa-:h-5 oa-:min-w-5 oa-:select-none oa-:items-center oa-:justify-center oa-:rounded-md oa-:px-1 oa-:font-medium oa-:text-sidebar-foreground oa-:text-xs oa-:tabular-nums',
        'oa-:peer-hover/menu-button:text-sidebar-accent-foreground oa-:peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        'oa-:peer-data-[size=sm]/menu-button:top-1',
        'oa-:peer-data-[size=default]/menu-button:top-1.5',
        'oa-:peer-data-[size=lg]/menu-button:top-2.5',
        'oa-:group-data-[collapsible=icon]:hidden',
        className
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      className={cn(
        'oa-:flex oa-:h-8 oa-:items-center oa-:gap-2 oa-:rounded-md oa-:px-2',
        className
      )}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="oa-:size-4 oa-:rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="oa-:h-4 oa-:max-w-(--skeleton-width) oa-:flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'oa-:mx-3.5 oa-:flex oa-:min-w-0 oa-:translate-x-px oa-:flex-col oa-:gap-1 oa-:border-sidebar-border oa-:border-l oa-:px-2.5 oa-:py-0.5',
        'oa-:group-data-[collapsible=icon]:hidden',
        className
      )}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('oa-:group/menu-sub-item oa-:relative', className)}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'a';

  return (
    <Comp
      className={cn(
        'oa-:flex oa-:h-7 oa-:min-w-0 oa-:-translate-x-px oa-:items-center oa-:gap-2 oa-:overflow-hidden oa-:rounded-md oa-:px-2 oa-:text-sidebar-foreground oa-:outline-hidden oa-:ring-sidebar-ring oa-:hover:bg-sidebar-accent oa-:hover:text-sidebar-accent-foreground oa-:focus-visible:ring-2 oa-:active:bg-sidebar-accent oa-:active:text-sidebar-accent-foreground oa-:disabled:pointer-events-none oa-:disabled:opacity-50 oa-:aria-disabled:pointer-events-none oa-:aria-disabled:opacity-50 oa-:[&>span:last-child]:truncate oa-:[&>svg]:size-4 oa-:[&>svg]:shrink-0 oa-:[&>svg]:text-sidebar-accent-foreground',
        'oa-:data-[active=true]:bg-sidebar-accent oa-:data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'oa-:text-xs',
        size === 'md' && 'oa-:text-sm',
        'oa-:group-data-[collapsible=icon]:hidden',
        className
      )}
      data-active={isActive}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-slot="sidebar-menu-sub-button"
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
