import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  href = '/',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-lg' },
    md: { box: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { box: 'w-11 h-11', icon: 'w-6 h-6', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Brand Geometric Neural 'M' Mark */}
      <div
        className={`${currentSize.box} rounded-xl bg-gradient-to-br from-[#F4F6A6] via-[#D4D686] to-[#C6283D] flex items-center justify-center p-[1px] shadow-lg shadow-[#F4F6A6]/10 transition-transform duration-300 hover:scale-105`}
      >
        <div className="w-full h-full bg-[#0B0B0C] rounded-[11px] flex items-center justify-center relative overflow-hidden">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`${currentSize.icon} text-[#F4F6A6]`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 18V6L12 14L20 6V18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="14" r="1.5" fill="#C6283D" />
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`${currentSize.text} font-bold tracking-tight text-[#F5F5F0]`}>
          MARIAN<span className="text-[#F4F6A6]">.AI</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F6A6] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
