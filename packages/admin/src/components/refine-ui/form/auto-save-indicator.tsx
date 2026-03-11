'use client';

import { type AutoSaveIndicatorProps, useTranslate } from '@refinedev/core';
import { AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = AutoSaveIndicatorProps;

export function AutoSaveIndicator({
  status,
  elements: elementsFromProps,
}: Props) {
  const t = useTranslate();
  const [shouldFadeSuccess, setShouldFadeSuccess] = useState(false);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setShouldFadeSuccess(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        setShouldFadeSuccess(false);
      };
    }
    setShouldFadeSuccess(false);
  }, [status]);

  const elements = {
    loading: elementsFromProps?.loading ?? (
      <div
        className={cn(
          'oa-:flex',
          'oa-:items-center',
          'oa-:h-9',
          'oa-:text-sm',
          'oa-:text-sky-600',
          'oa-:px-3'
        )}
      >
        <Loader2
          className={cn('oa-:h-4', 'oa-:w-4', 'oa-:mr-2', 'oa-:animate-spin')}
        />
        <span className={cn('oa-:font-medium')}>
          {t('autoSave.saving', 'Saving')}
        </span>
      </div>
    ),
    success: elementsFromProps?.success ?? (
      <div
        className={cn(
          'oa-:flex',
          'oa-:items-center',
          'oa-:h-9',
          'oa-:text-sm',
          'oa-:text-emerald-500',
          'oa-:transition-opacity',
          'oa-:duration-500',
          'oa-:px-3',
          {
            'opacity-50': shouldFadeSuccess,
          }
        )}
      >
        <CheckCircle2 className={cn('oa-:h-4', 'oa-:w-4', 'oa-:mr-2')} />
        <span className={cn('oa-:font-medium')}>
          {t('autoSave.saved', 'Saved')}
        </span>
      </div>
    ),
    error: elementsFromProps?.error ?? (
      <div
        className={cn(
          'oa-:flex',
          'oa-:items-center',
          'oa-:h-9',
          'oa-:text-sm',
          'oa-:text-rose-400',
          'oa-:px-3'
        )}
      >
        <AlertTriangle className={cn('oa-:h-4', 'oa-:w-4', 'oa-:mr-2')} />
        <span className={cn('oa-:font-medium')}>
          {t('autoSave.failed', 'Failed')}
        </span>
      </div>
    ),
    idle: elementsFromProps?.idle ?? (
      <div
        className={cn(
          'oa-:flex',
          'oa-:items-center',
          'oa-:h-9',
          'oa-:text-sm',
          'oa-:text-slate-500',
          'oa-:px-3'
        )}
      >
        <Clock className={cn('oa-:h-4', 'oa-:w-4', 'oa-:mr-2')} />
        <span>{t('autoSave.idle', 'Idle')} </span>
      </div>
    ),
  };

  return <div className={cn('oa-:flex')}>{elements[status]}</div>;
}

AutoSaveIndicator.displayName = 'AutoSaveIndicator';
