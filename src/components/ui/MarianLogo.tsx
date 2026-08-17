import React from 'react';

interface MarianLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export const MarianLogo: React.FC<MarianLogoProps> = ({
  className = '',
  size = 28,
  showText = true,
  textClassName = 'text-lg font-semibold tracking-tight',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-lg bg-[#121214] border border-white/10 shadow-sm p-1.5 overflow-hidden transition-transform duration-200 hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Subtle glow effect behind neural M */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F4F6A6]/20 to-[#C6283D]/10 blur-sm pointer-events-none" />

        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Geometric M neural connections */}
          <path
            d="M4 26V6L16 20L28 6V26"
            stroke="#F4F6A6"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Accent neural node */}
          <circle cx="16" cy="20" r="2.5" fill="#C6283D" />
          <circle cx="4" cy="6" r="2" fill="#F4F6A6" />
          <circle cx="28" cy="6" r="2" fill="#F4F6A6" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1">
          <span className={`font-mono ${textClassName}`}>
            MARIAN<span className="text-[#F4F6A6] font-bold">.AI</span>
          </span>
        </div>
      )}
    </div>
  );
};
