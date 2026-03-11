'use client';

import type { PropsWithChildren } from 'react';
import { Header } from '@/components/refine-ui/layout/header';
import { Sidebar } from '@/components/refine-ui/layout/sidebar';
import { ThemeProvider } from '@/components/refine-ui/theme/theme-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <Header />
          <main
            className={cn(
              'oa-:@container/main',
              'oa-:container',
              'oa-:mx-auto',
              'oa-:relative',
              'oa-:w-full',
              'oa-:flex',
              'oa-:flex-col',
              'oa-:flex-1',
              'oa-:px-2',
              'oa-:pt-4',
              'oa-:md:p-4',
              'oa-:lg:px-6',
              'oa-:lg:pt-6'
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
