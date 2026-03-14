import type { IdentityResponse } from '@refinedev/core';

export interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: IdentityResponse | null;
}

export interface UseAdminResourcesReturn {
  error: Error | null;
  isLoading: boolean;
  resources: Array<{
    name: string;
    label: string;
    icon?: string;
    list?: string;
    create?: string;
    edit?: string;
    show?: string;
  }>;
}
