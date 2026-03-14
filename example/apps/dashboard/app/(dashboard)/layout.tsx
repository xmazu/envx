import { AuthProvider } from '@example/auth';
import { SidebarProvider } from '@example/ui/components/sidebar';

import { DashboardSidebarProvider } from './sidebar-provider';
import { AppSidebar } from '@/components/app-sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <DashboardSidebarProvider>
          <AppSidebar />
          {children}
        </DashboardSidebarProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}
