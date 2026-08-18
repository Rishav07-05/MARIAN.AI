import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0B0C] border-t border-[#27272A] pt-16 pb-12 text-sm text-[#A1A1AA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#27272A]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-[#A1A1AA] max-w-sm leading-relaxed">
              MARIAN.AI is an intelligent, high-precision personal AI assistant engineered for deep reasoning, architectural synthesis, and contextual execution.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121214] border border-[#27272A] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#F5F5F0]">All Systems Operational</span>
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="font-mono text-xs text-[#F5F5F0] uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="/chat" className="hover:text-[#F4F6A6] transition-colors">Chat Assistant</Link></li>
              <li><a href="#capabilities" className="hover:text-[#F4F6A6] transition-colors">Capabilities</a></li>
              <li><a href="#pricing" className="hover:text-[#F4F6A6] transition-colors">Pricing</a></li>
              <li><Link href="/settings/integrations" className="hover:text-[#F4F6A6] transition-colors">Google Calendar</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-mono text-xs text-[#F5F5F0] uppercase tracking-wider mb-4">Research</h4>
            <ul className="space-y-2.5">
              <li><a href="#research" className="hover:text-[#F4F6A6] transition-colors">Architecture Paper</a></li>
              <li><a href="#research" className="hover:text-[#F4F6A6] transition-colors">Reasoning Engine</a></li>
              <li><a href="#research" className="hover:text-[#F4F6A6] transition-colors">Safety Standards</a></li>
              <li><a href="#research" className="hover:text-[#F4F6A6] transition-colors">Benchmarking</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-mono text-xs text-[#F5F5F0] uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-[#F4F6A6] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#F4F6A6] transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-[#F4F6A6] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#F4F6A6] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
          <p>© {new Date().getFullYear()} MARIAN.AI Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for high-precision AI engineering</span>
            <span className="font-mono text-[#F4F6A6]">v3.4.0-omni</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
