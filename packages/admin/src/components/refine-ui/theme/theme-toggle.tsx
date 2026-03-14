'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/refine-ui/theme/theme-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('system');
        break;
      case 'system':
        setTheme('light');
        break;
      default:
        setTheme('light');
    }
  };

  return (
    <Button
      className={cn(
        'oa-:rounded-full',
        'oa-:border-sidebar-border',
        'oa-:bg-transparent',
        className,
        'oa-:h-10',
        'oa-:w-10'
      )}
      onClick={cycleTheme}
      size="icon"
      variant="outline"
    >
      <Sun
        className={cn(
          'oa-:h-[1.2rem]',
          'oa-:w-[1.2rem]',
          'oa-:rotate-0',
          'oa-:scale-100',
          'oa-:transition-all',
          'oa-:duration-200',
          {
            '-rotate-90 scale-0': theme === 'dark' || theme === 'system',
          }
        )}
      />
      <Moon
        className={cn(
          'oa-:absolute',
          'oa-:h-[1.2rem]',
          'oa-:w-[1.2rem]',
          'oa-:rotate-90',
          'oa-:scale-0',
          'oa-:transition-all',
          'oa-:duration-200',
          {
            'rotate-0 scale-100': theme === 'dark',
            'rotate-90 scale-0': theme === 'light' || theme === 'system',
          }
        )}
      />
      <Monitor
        className={cn(
          'oa-:absolute',
          'oa-:h-[1.2rem]',
          'oa-:w-[1.2rem]',
          'oa-:rotate-0',
          'oa-:scale-0',
          'oa-:transition-all',
          'oa-:duration-200',
          {
            'scale-100': theme === 'system',
            'scale-0': theme === 'light' || theme === 'dark',
          }
        )}
      />
      <span className="oa-:sr-only">Toggle theme (Light → Dark → System)</span>
    </Button>
  );
}

ThemeToggle.displayName = 'ThemeToggle';
