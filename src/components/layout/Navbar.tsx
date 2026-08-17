'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MarianLogo } from '@/components/ui/MarianLogo';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0B0B0C]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center">
          <MarianLogo size={32} />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#product"
            className="text-sm font-medium text-[#A1A1AA] hover:text-[#F5F5F0] transition-colors"
          >
            Product
          </a>
          <a
            href="#research"
            className="text-sm font-medium text-[#A1A1AA] hover:text-[#F5F5F0] transition-colors"
          >
            Research
          </a>
          <a
            href="#capabilities"
            className="text-sm font-medium text-[#A1A1AA] hover:text-[#F5F5F0] transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-[#A1A1AA] hover:text-[#F5F5F0] transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Start using MARIAN
            </Button>
          </Link>
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
        <div className="md:hidden bg-[#0B0B0C] border-b border-white/10 px-6 py-6 space-y-4">
          <a
            href="#product"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#A1A1AA] hover:text-[#F5F5F0]"
          >
            Product
          </a>
          <a
            href="#research"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#A1A1AA] hover:text-[#F5F5F0]"
          >
            Research
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#A1A1AA] hover:text-[#F5F5F0]"
          >
            Capabilities
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#A1A1AA] hover:text-[#F5F5F0]"
          >
            Pricing
          </a>
          <div className="pt-4 border-t border-white/10 space-y-3">
            <Link href="/login" className="block w-full">
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/chat" className="block w-full">
              <Button variant="primary" className="w-full justify-center">
                Start using MARIAN
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
