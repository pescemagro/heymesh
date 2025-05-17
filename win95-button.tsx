
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  active?: boolean;
}

const Win95Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', active = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'win95-button font-ms-sans relative select-none',
          active && 'shadow-win95-btn-pressed translate-y-px',
          size === 'sm' && 'px-2 py-0.5 text-xs',
          size === 'lg' && 'px-6 py-2',
          variant === 'primary' && 'bg-win95-titlebar text-white',
          variant === 'destructive' && 'bg-red-600 text-white',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Win95Button.displayName = 'Win95Button';

export { Win95Button };
