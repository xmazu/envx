'use client';

import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from './theme-provider';

type ThemeOption = {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ReactNode;
};

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: <Sun className="oa-:h-4 oa-:w-4" />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <Moon className="oa-:h-4 oa-:w-4" />,
  },
  {
    value: 'system',
    label: 'System',
    icon: <Monitor className="oa-:h-4 oa-:w-4" />,
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
            'oa-:w-full',
            'oa-:justify-between',
            'oa-:px-3',
            'oa-:text-left',
            'oa-:text-sm',
            'oa-:font-normal',
            'oa-:text-foreground',
            'oa-:hover:bg-accent',
            'oa-:hover:text-accent-foreground',
            'oa-:focus-visible:outline-none',
            'oa-:focus-visible:ring-2',
            'oa-:focus-visible:ring-ring'
          )}
          size="lg"
          variant="ghost"
        >
          <div className="oa-:flex oa-:items-center oa-:gap-2">
            {currentTheme?.icon}
            <span>{currentTheme?.label}</span>
          </div>
          <ChevronDown className="oa-:h-4 oa-:w-4 oa-:opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="oa-:min-w-40 oa-:space-y-1">
        {themeOptions.map((option) => {
          const isSelected = theme === option.value;

          return (
            <DropdownMenuItem
              className={cn(
                'oa-:relative oa-:flex oa-:cursor-pointer oa-:items-center oa-:gap-2 oa-:pr-8',
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
                <Check className="oa-:absolute oa-:right-2 oa-:h-4 oa-:w-4 oa-:text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ThemeSelect.displayName = 'ThemeSelect';
