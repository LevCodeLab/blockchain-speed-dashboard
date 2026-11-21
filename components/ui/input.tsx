import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'placeholder:text-[#71717A] border-[#26262E] bg-[#0B0B0E] text-[#FFFFFF] h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-[#FFFFFF]',
        className
      )}
      {...props}
    />
  );
}

export { Input };
