'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import Logo from '@/components/ui/Logo';
import { ArrowRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isSignedIn } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0B0C]/90 backdrop-blur-xl border-b border-[#27272A] py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Logo size="md" />

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#product"
            className="text-sm font-medium text-[#A1A1AA] hover:text-[#F4F6A6] transition-colors"
          >
            Product
          </a>
          <a
            href="#research"
            className="text-sm font-medium text-[#A1A1AA] hover:text-[#F4F6A6] transition-colors"
          >
            Research
          </a>
          <a
            href="#capabilities"
            className="text-sm font-medium text-[#A1A1AA] hover:text-[#F4F6A6] transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-[#A1A1AA] hover:text-[#F4F6A6] transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link
                href="/chat"
                className="px-4 py-2 rounded-xl bg-[#F4F6A6] text-[#0B0B0C] hover:bg-[#D4D686] font-semibold text-sm transition-all duration-200 shadow-md flex items-center gap-2 group"
              >
                <span>Launch Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-9 h-9 border border-[#27272A] hover:border-[#F4F6A6] transition',
                  },
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-[#A1A1AA] hover:text-[#F5F5F0] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/chat"
                className="px-4 py-2 rounded-xl bg-[#F4F6A6] text-[#0B0B0C] hover:bg-[#D4D686] font-semibold text-sm transition-all duration-200 shadow-md shadow-[#F4F6A6]/10 flex items-center gap-2 group"
              >
                <span>Start using MARIAN</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A1A1AA] hover:text-[#F5F5F0] focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0B0C]/95 backdrop-blur-2xl border-b border-[#27272A] px-6 py-6 space-y-4">
          <a
            href="#product"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#A1A1AA] hover:text-[#F4F6A6]"
          >
            Product
          </a>
          <a
            href="#research"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#A1A1AA] hover:text-[#F4F6A6]"
          >
            Research
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#A1A1AA] hover:text-[#F4F6A6]"
          >
            Capabilities
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#A1A1AA] hover:text-[#F4F6A6]"
          >
            Pricing
          </a>

          <div className="pt-4 border-t border-[#27272A] space-y-3">
            {isSignedIn ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#F4F6A6] text-[#0B0B0C] font-semibold text-center block text-sm"
                >
                  Launch Chat
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 rounded-xl border border-[#27272A] text-center text-sm font-medium text-[#F5F5F0]"
                >
                  Sign In
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 rounded-xl bg-[#F4F6A6] text-[#0B0B0C] font-semibold text-center text-sm"
                >
                  Start using MARIAN
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
