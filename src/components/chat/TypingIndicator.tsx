import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3 text-xs text-[#A1A1AA] py-2 px-1">
      <div className="w-5 h-5 rounded-md bg-[#121214] border border-white/10 flex items-center justify-center text-[#F4F6A6]">
        <Sparkles className="w-3 h-3 animate-spin" />
      </div>
      <div className="flex items-center gap-1.5 font-mono text-[11px]">
        <span className="text-[#F5F5F0]">MARIAN is reasoning</span>
        <span className="flex items-center gap-1 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4F6A6] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4F6A6] animate-pulse [animation-delay:200ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4F6A6] animate-pulse [animation-delay:400ms]" />
        </span>
      </div>
    </div>
  );
};
