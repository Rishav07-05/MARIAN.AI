import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'crimson' | 'zinc' | 'green' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'yellow',
  size = 'sm',
  className,
}) => {
  const base = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const variants = {
    yellow: 'bg-[#F4F6A6]/15 text-[#F4F6A6] border border-[#F4F6A6]/30',
    crimson: 'bg-[#C6283D]/15 text-[#E5485D] border border-[#C6283D]/30',
    zinc: 'bg-[#18181B] text-[#A1A1AA] border border-white/10',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    outline: 'border border-white/20 text-[#F5F5F0]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return <span className={cn(base, variants[variant], sizes[size], className)}>{children}</span>;
};
