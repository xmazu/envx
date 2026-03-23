'use client';

import { AdminContextProvider } from '@/hooks';
import { Layout } from '@/ui/layout/layout';

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminContextProvider>
      <Layout>{children}</Layout>
    </AdminContextProvider>
  );
};
