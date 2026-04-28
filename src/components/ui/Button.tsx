import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-zinc-900 text-white hover:bg-white hover:text-zinc-900 border border-zinc-900 transition-all duration-300 relative overflow-hidden group',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 border border-transparent hover:border-zinc-900',
      ghost: 'bg-transparent text-zinc-600 hover:text-zinc-900 transition-all duration-200 relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-zinc-900 hover:before:w-full before:transition-all',
      outline: 'bg-transparent border border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-all duration-300',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs rounded-none uppercase tracking-widest font-bold',
      md: 'px-8 py-4 rounded-none text-sm uppercase tracking-widest font-bold',
      lg: 'px-12 py-6 text-base rounded-none uppercase tracking-[0.2em] font-black',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-3 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
