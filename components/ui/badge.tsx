import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#3B82F6] text-white',
        secondary: 'border-transparent bg-[#06B6D4] text-white',
        destructive: 'border-transparent bg-[#EF4444] text-white',
        success: 'border-transparent bg-[#10B981] text-white',
        warning: 'border-transparent bg-[#F59E0B] text-black',
        outline: 'border-[#1F2937] text-[#F9FAFB]',
        muted: 'border-transparent bg-[#374151] text-[#9CA3AF]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
