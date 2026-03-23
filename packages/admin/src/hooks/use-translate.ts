'use client';

import { useCallback } from 'react';
import type { TranslateFunction } from '@/types';

const translations: Record<string, string> = {
  'autoSave.saving': 'Saving...',
  'autoSave.saved': 'Saved',
  'autoSave.failed': 'Failed to save',
  'autoSave.idle': 'Idle',
};

export function useTranslate(): TranslateFunction {
  return useCallback((key: string, defaultMessage?: string): string => {
    return translations[key] ?? defaultMessage ?? key;
  }, []);
}
