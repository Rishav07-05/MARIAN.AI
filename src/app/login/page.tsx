'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MarianLogo } from '@/components/ui/MarianLogo';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleLogin = async () => {
    setLocalLoading(true);
    await login();
    setLocalLoading(false);
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F0] flex flex-col justify-between p-6 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F4F6A6]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full relative z-10">
        <Link href="/" className="flex items-center">
          <MarianLogo size={32} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-[#F5F5F0] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="max-w-md w-full mx-auto relative z-10 py-12">
        <div className="rounded-2xl bg-[#121214] border border-white/10 p-8 shadow-2xl space-y-6 text-center">
          <div className="space-y-2">
            <div className="inline-flex p-3 rounded-xl bg-[#18181B] border border-white/10 mb-2">
              <Lock className="w-6 h-6 text-[#F4F6A6]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F0]">
              Sign in to <span className="font-mono text-[#F4F6A6]">MARIAN.AI</span>
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Access your intelligent personal assistant workspace.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[#C6283D]/10 border border-[#C6283D]/30 text-xs text-[#C6283D] font-medium text-left">
              {error}
            </div>
          )}

          {/* Primary Google Auth */}
          <div className="pt-2">
            <GoogleButton onClick={handleLogin} isLoading={isLoading || localLoading} />
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#71717A]">
              <Shield className="w-3.5 h-3.5 text-[#F4F6A6]" />
              <span>Zero clear-text credentials retained</span>
            </div>
            <p className="text-[10px] text-[#71717A] leading-relaxed">
              By continuing, you accept MARIAN.AI&apos;s Terms of Service and Privacy Guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#71717A] font-mono relative z-10">
        MARIAN.AI Security & OAuth Protocol v3.4
      </div>
    </div>
  );
}
