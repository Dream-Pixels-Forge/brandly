import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ className, children, padding = 'md', ...props }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-10',
    lg: 'p-16',
  };

  return (
    <div
      className={cn(
        'bg-white border border-zinc-900 rounded-none relative group overflow-hidden transition-all duration-500',
        paddings[padding],
        className
      )}
      {...props}
    >
      {/* Structural Inlay */}
      <div className="absolute top-0 right-0 w-8 h-[1px] bg-zinc-900 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute top-0 right-0 h-8 w-[1px] bg-zinc-900 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-900 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
      
      {children}
    </div>
  );
}
