import { useEffect, useState } from 'react';
import type { UseAdminResourcesReturn } from './types';

export function useAdminResources(): UseAdminResourcesReturn {
  const [resources, setResources] = useState<
    UseAdminResourcesReturn['resources']
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Placeholder implementation
    setResources([]);
    setIsLoading(false);
  }, []);

  return {
    resources,
    isLoading,
    error,
  };
}
