import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#A1A1AA]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#A1A1AA] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-[#121214] text-[#F5F5F0] border border-white/10 rounded-lg px-3.5 py-2 text-sm placeholder-[#71717A] focus:outline-none focus:border-[#F4F6A6]/60 focus:ring-1 focus:ring-[#F4F6A6]/40 transition-colors',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-[#C6283D] focus:border-[#C6283D] focus:ring-[#C6283D]/40',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#A1A1AA]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#C6283D] font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-[#A1A1AA]">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full bg-[#121214] text-[#F5F5F0] border border-white/10 rounded-lg p-3 text-sm placeholder-[#71717A] focus:outline-none focus:border-[#F4F6A6]/60 focus:ring-1 focus:ring-[#F4F6A6]/40 transition-colors resize-none',
            error && 'border-[#C6283D]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#C6283D] font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
