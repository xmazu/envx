import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'oa-:animate-pulse oa-:rounded-md oa-:bg-accent',
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
