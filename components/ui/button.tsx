import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg",
  {
    variants: {
      variant: {
        default: 
          'bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary-light active:scale-[0.98] hover:-translate-y-0.5',
        
        gradient: 
          'bg-gradient-to-r from-primary-light to-primary-dark text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
        
        glass:
          'glass text-foreground hover:bg-background-elevated',
        
        outline:
          'border-2 border-border bg-transparent hover:bg-background-elevated hover:border-primary transition-all',
        
        ghost:
          'hover:bg-background-elevated active:bg-muted',

        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-sm hover:shadow-md',
        
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
        
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-6 py-2 has-[>svg]:px-4',
        sm: 'h-8 px-4 text-xs has-[>svg]:px-3',
        lg: 'h-12 px-8 text-base has-[>svg]:px-6',
        xl: 'h-14 px-10 text-lg has-[>svg]:px-8',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
