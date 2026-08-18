'use client';

import React from 'react';
import { UserProfile } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MarianLogo } from '@/components/ui/MarianLogo';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F0] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0B0B0C]/80 backdrop-blur-md px-4 md:px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-white/10 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workspace</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <MarianLogo size={24} />
            <span className="text-sm font-semibold text-[#A1A1AA]">Account & Profile</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center shadow-2xl rounded-2xl border border-white/10 overflow-hidden bg-[#121214]">
          <UserProfile
            appearance={{
              elements: {
                rootBox: 'w-full shadow-none',
                card: 'bg-transparent shadow-none border-none max-w-full text-white',
                navbar: 'border-r border-white/10 bg-[#0B0B0C]',
                navbarButton: 'text-[#A1A1AA] hover:text-white text-xs',
                navbarButtonActive: 'text-[#F4F6A6] bg-white/5 font-semibold',
                headerTitle: 'text-white text-xl font-bold',
                headerSubtitle: 'text-gray-400 text-xs',
                profileSectionTitleText: 'text-gray-300 font-semibold border-b border-white/10 pb-2 text-sm',
                userPreviewMainIdentifier: 'text-white font-bold',
                userPreviewSecondaryIdentifier: 'text-gray-400 text-xs',
                formButtonPrimary: 'bg-[#F4F6A6] hover:bg-[#D4D686] text-black font-semibold text-xs transition',
                formButtonReset: 'bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition',
                formFieldLabel: 'text-gray-300 text-xs font-medium',
                formFieldInput: 'bg-white/5 border border-white/10 text-white focus:border-[#F4F6A6] rounded-lg text-xs',
                accordionTriggerButton: 'text-white hover:text-[#F4F6A6]',
                badge: 'bg-[#F4F6A6]/10 text-[#F4F6A6] border border-[#F4F6A6]/30 text-xs font-mono',
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}
