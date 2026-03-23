'use client';

import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { SidebarInset, SidebarProvider } from '@/ui/shadcn/sidebar';
import { ThemeProvider } from '@/ui/theme/theme-provider';
import { Header } from './header';
import { Sidebar } from './sidebar';

export function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <Header />
          <main
            className={cn(
              '@container/main',
              'container',
              'mx-auto',
              'relative',
              'w-full',
              'flex',
              'flex-col',
              'flex-1',
              'px-2',
              'pt-4',
              'md:p-4',
              'lg:px-6',
              'lg:pt-6'
            )}
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

Layout.displayName = 'Layout';
