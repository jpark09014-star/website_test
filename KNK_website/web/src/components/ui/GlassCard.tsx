import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 md:p-8 backdrop-blur-xl',
        'border border-white/20 bg-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
