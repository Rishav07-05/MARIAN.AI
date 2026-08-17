'use client';

import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'code', value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const lines = value.trim().split('\n');

  return (
    <div className="my-4 rounded-xl border border-white/10 bg-[#0B0B0C] overflow-hidden text-xs shadow-lg font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121214] border-b border-white/10 text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-[#F4F6A6]" />
          <span className="font-medium lowercase tracking-wide">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with line numbers */}
      <div className="overflow-x-auto p-4 text-[#F5F5F0] leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                <td className="w-8 select-none text-[#71717A] text-right pr-4 text-[11px] align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre align-top">{line || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
