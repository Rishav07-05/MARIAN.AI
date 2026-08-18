'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      <div className="mb-8 text-center z-10 space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-black shadow-lg shadow-cyan-500/20">
            M
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            MARIAN<span className="text-cyan-400">.AI</span>
          </span>
        </Link>
        <p className="text-sm text-gray-400 max-w-sm">
          Create your account with Clerk Authentication.
        </p>
      </div>

      <div className="z-10 shadow-2xl rounded-2xl border border-white/10 overflow-hidden bg-gray-900/80 backdrop-blur-xl">
        <SignUp
          appearance={{
            elements: {
              card: 'bg-transparent shadow-none p-6',
              headerTitle: 'text-white text-xl font-bold',
              headerSubtitle: 'text-gray-400 text-xs',
              socialButtonsBlockButton:
                'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition',
              formButtonPrimary:
                'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium shadow-md shadow-cyan-500/20',
              formFieldLabel: 'text-gray-300 text-xs font-medium',
              formFieldInput:
                'bg-white/5 border border-white/10 text-white focus:border-cyan-500 rounded-lg',
              footerActionLink: 'text-cyan-400 hover:text-cyan-300',
              identityPreviewText: 'text-gray-300',
            },
          }}
        />
      </div>
    </div>
  );
}

