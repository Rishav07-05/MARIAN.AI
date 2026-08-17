'use client';

import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

interface GoogleButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  text?: string;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  onClick,
  isLoading = false,
  text = 'Continue with Google',
}) => {
  return (
    <div className="w-full space-y-3">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-[#18181B] hover:bg-[#222226] text-[#F5F5F0] border border-white/15 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F4F6A6]/40 disabled:opacity-50 active:scale-[0.99] shadow-lg"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-[#F4F6A6]" />
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
        )}
        <span>{text}</span>
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#71717A]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#F4F6A6]" />
        <span>Enterprise OAuth 2.0 • End-to-end encrypted sessions</span>
      </div>
    </div>
  );
};
