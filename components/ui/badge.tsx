import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-mono font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000]',
        secondary: 'border-[#26262E] bg-[#141418] text-[#E4E4E7]',
        destructive: 'border-[#26262E] bg-[#141418] text-[#FFFFFF]',
        outline: 'border-[#26262E] bg-[#141418] text-[#A1A1AA]',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
