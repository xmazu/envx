'use client';

import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export const LoadingOverlay = React.forwardRef<
  HTMLDivElement,
  LoadingOverlayProps
>(({ className, loading = false, children, ...props }, ref) => {
  if (!loading) {
    return children;
  }

  return (
    <div className="oa-:relative" ref={ref} {...props}>
      {children}
      <div
        className={cn(
          'oa-:absolute oa-:inset-0 oa-:z-50 oa-:flex oa-:items-center oa-:justify-center',
          'oa-:bg-background/60',
          className
        )}
      >
        <div className="oa-:flex oa-:flex-col oa-:items-center oa-:gap-2">
          <Loader2 className="oa-:h-8 oa-:w-8 oa-:animate-spin oa-:text-primary" />
        </div>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
