'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Lock, ArrowRight, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  guestMessageCount: number;
  maxGuestMessages: number;
}

export function AuthModal({ isOpen, onClose, guestMessageCount, maxGuestMessages }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#12141C] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 mb-1">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Unlock Unlimited MARIAN<span className="text-cyan-400">.AI</span> Access
            </h2>
            <p className="text-sm text-gray-300">
              You&apos;ve used <span className="font-semibold text-cyan-400">{guestMessageCount}/{maxGuestMessages}</span> free guest messages!
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
              <Sparkles className="w-4 h-4" />
              <span>What happens next:</span>
            </div>
            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside pl-1">
              <li>All your <span className="text-white font-medium">{guestMessageCount} guest messages</span> will be saved to your account.</li>
              <li>Unlimited access to MARIAN 3 Omni local model pipeline.</li>
              <li>Persistent chat history across all your devices.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/sign-up"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition active:scale-[0.98]"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/sign-in"
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white font-medium text-sm transition"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
