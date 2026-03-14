'use client';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import * as React from 'react';
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from 'react-day-picker';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      captionLayout={captionLayout}
      className={cn(
        'oa-:group/calendar oa-:bg-background oa-:p-3 oa-:[--cell-size:--spacing(8)] oa-:[[data-slot=card-content]_&]:bg-transparent oa-:[[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      classNames={{
        root: cn('oa-:w-fit', defaultClassNames.root),
        months: cn(
          'oa-:relative oa-:flex oa-:flex-col oa-:gap-4 oa-:md:flex-row',
          defaultClassNames.months
        ),
        month: cn(
          'oa-:flex oa-:w-full oa-:flex-col oa-:gap-4',
          defaultClassNames.month
        ),
        nav: cn(
          'oa-:absolute oa-:inset-x-0 oa-:top-0 oa-:flex oa-:w-full oa-:items-center oa-:justify-between oa-:gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'oa-:size-(--cell-size) oa-:select-none oa-:p-0 oa-:aria-disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'oa-:size-(--cell-size) oa-:select-none oa-:p-0 oa-:aria-disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'oa-:flex oa-:h-(--cell-size) oa-:w-full oa-:items-center oa-:justify-center oa-:px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'oa-:flex oa-:h-(--cell-size) oa-:w-full oa-:items-center oa-:justify-center oa-:gap-1.5 oa-:font-medium oa-:text-sm',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'oa-:relative oa-:rounded-md oa-:border oa-:border-input oa-:shadow-xs oa-:has-focus:border-ring oa-:has-focus:ring-[3px] oa-:has-focus:ring-ring/50',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'oa-:absolute oa-:inset-0 oa-:bg-popover oa-:opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'oa-:select-none oa-:font-medium',
          captionLayout === 'label'
            ? 'oa-:text-sm'
            : 'oa-:flex oa-:h-8 oa-:items-center oa-:gap-1 oa-:rounded-md oa-:pr-1 oa-:pl-2 oa-:text-sm oa-:[&>svg]:size-3.5 oa-:[&>svg]:text-muted-foreground',
          defaultClassNames.caption_label
        ),
        table: 'oa-:w-full oa-:border-collapse',
        weekdays: cn('oa-:flex', defaultClassNames.weekdays),
        weekday: cn(
          'oa-:flex-1 oa-:select-none oa-:rounded-md oa-:font-normal oa-:text-[0.8rem] oa-:text-muted-foreground',
          defaultClassNames.weekday
        ),
        week: cn('oa-:mt-2 oa-:flex oa-:w-full', defaultClassNames.week),
        week_number_header: cn(
          'oa-:w-(--cell-size) oa-:select-none',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'oa-:select-none oa-:text-[0.8rem] oa-:text-muted-foreground',
          defaultClassNames.week_number
        ),
        day: cn(
          'oa-:group/day oa-:relative oa-:aspect-square oa-:h-full oa-:w-full oa-:select-none oa-:p-0 oa-:text-center oa-:[&:last-child[data-selected=true]_button]:rounded-r-md',
          props.showWeekNumber
            ? 'oa-:[&:nth-child(2)[data-selected=true]_button]:rounded-l-md'
            : 'oa-:[&:first-child[data-selected=true]_button]:rounded-l-md',
          defaultClassNames.day
        ),
        range_start: cn(
          'oa-:rounded-l-md oa-:bg-accent',
          defaultClassNames.range_start
        ),
        range_middle: cn('oa-:rounded-none', defaultClassNames.range_middle),
        range_end: cn(
          'oa-:rounded-r-md oa-:bg-accent',
          defaultClassNames.range_end
        ),
        today: cn(
          'oa-:rounded-md oa-:bg-accent oa-:text-accent-foreground oa-:data-[selected=true]:rounded-none',
          defaultClassNames.today
        ),
        outside: cn(
          'oa-:text-muted-foreground oa-:aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn(
          'oa-:text-muted-foreground oa-:opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('oa-:invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              className={cn(className)}
              data-slot="calendar"
              ref={rootRef}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                className={cn('oa-:size-4', className)}
                {...props}
              />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('oa-:size-4', className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon
              className={cn('oa-:size-4', className)}
              {...props}
            />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="oa-:flex oa-:size-(--cell-size) oa-:items-center oa-:justify-center oa-:text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <Button
      className={cn(
        'oa-:flex oa-:aspect-square oa-:size-auto oa-:w-full oa-:min-w-(--cell-size) oa-:flex-col oa-:gap-1 oa-:font-normal oa-:leading-none oa-:data-[range-end=true]:rounded-md oa-:data-[range-middle=true]:rounded-none oa-:data-[range-start=true]:rounded-md oa-:data-[range-end=true]:rounded-r-md oa-:data-[range-start=true]:rounded-l-md oa-:data-[range-end=true]:bg-primary oa-:data-[range-middle=true]:bg-accent oa-:data-[range-start=true]:bg-primary oa-:data-[selected-single=true]:bg-primary oa-:data-[range-end=true]:text-primary-foreground oa-:data-[range-middle=true]:text-accent-foreground oa-:data-[range-start=true]:text-primary-foreground oa-:data-[selected-single=true]:text-primary-foreground oa-:group-data-[focused=true]/day:relative oa-:group-data-[focused=true]/day:z-10 oa-:group-data-[focused=true]/day:border-ring oa-:group-data-[focused=true]/day:ring-[3px] oa-:group-data-[focused=true]/day:ring-ring/50 oa-:dark:hover:text-accent-foreground oa-:[&>span]:text-xs oa-:[&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      data-day={day.date.toLocaleDateString()}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      ref={ref}
      size="icon"
      variant="ghost"
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
