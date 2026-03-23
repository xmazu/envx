'use client';

import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu';
import { useTheme } from './theme-provider';

interface ThemeOption {
  icon: React.ReactNode;
  label: string;
  value: 'light' | 'dark' | 'system';
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: <Sun className="h-4 w-4" />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <Moon className="h-4 w-4" />,
  },
  {
    value: 'system',
    label: 'System',
    icon: <Monitor className="h-4 w-4" />,
  },
];

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  const currentTheme = themeOptions.find((option) => option.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'w-full',
            'justify-between',
            'px-3',
            'text-left',
            'text-sm',
            'font-normal',
            'text-foreground',
            'hover:bg-accent',
            'hover:text-accent-foreground',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring'
          )}
          size="lg"
          variant="ghost"
        >
          <div className="flex items-center gap-2">
            {currentTheme?.icon}
            <span>{currentTheme?.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 space-y-1">
        {themeOptions.map((option) => {
          const isSelected = theme === option.value;

          return (
            <DropdownMenuItem
              className={cn(
                'relative flex cursor-pointer items-center gap-2 pr-8',
                {
                  'bg-accent text-accent-foreground': isSelected,
                }
              )}
              key={option.value}
              onClick={() => setTheme(option.value)}
            >
              {option.icon}
              <span>{option.label}</span>
              {isSelected && (
                <Check className="absolute right-2 h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ThemeSelect.displayName = 'ThemeSelect';
