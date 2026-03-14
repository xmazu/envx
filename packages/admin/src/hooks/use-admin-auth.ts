import type { UseAdminAuthReturn } from './types';

export function useAdminAuth(): UseAdminAuthReturn {
  return {
    isAuthenticated: true,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    user: null,
  };
}
