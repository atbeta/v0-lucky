import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-10 w-full min-w-0 rounded-lg',
        'bg-background-elevated border-2 border-border',
        'px-4 py-2 text-base md:text-sm',
        'text-foreground placeholder:text-foreground-tertiary',
        'selection:bg-primary selection:text-primary-foreground',
        'transition-all duration-200',
        'focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none',
        'hover:border-border-subtle',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
