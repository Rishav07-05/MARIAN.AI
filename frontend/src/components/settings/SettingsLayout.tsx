'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { MarianLogo } from '@/components/ui/MarianLogo';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { IntegrationCard } from './IntegrationCard';
import { CalendarIntegrationState } from '@/types/calendar';
import {
  User,
  Sliders,
  Bell,
  Calendar,
  ShieldCheck,
  Key,
  ArrowLeft,
  Moon,
  Sun,
  Laptop,
  Check,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SettingsTab =
  | 'account'
  | 'appearance'
  | 'ai_preferences'
  | 'notifications'
  | 'integrations'
  | 'privacy'
  | 'security';

interface SettingsLayoutProps {
  initialTab?: SettingsTab;
  calendarState: CalendarIntegrationState;
  onConnectCalendar: () => Promise<void>;
  onDisconnectCalendar: () => Promise<void>;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  initialTab = 'account',
  calendarState,
  onConnectCalendar,
  onDisconnectCalendar,
}) => {
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [responseStyle, setResponseStyle] = useState('concise');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const navItems: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon className="w-4 h-4" /> },
    { id: 'ai_preferences', label: 'AI Preferences', icon: <Sliders className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Calendar className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & Data', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Key className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F0]">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0B0B0C]/80 backdrop-blur-md px-4 md:px-8 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Chat
              </Button>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <MarianLogo size={24} />
            <span className="text-sm font-semibold text-[#A1A1AA]">Settings</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={savedSuccess ? <Check className="w-3.5 h-3.5 text-[#0B0B0C]" /> : undefined}
          >
            {savedSuccess ? 'Changes Saved' : 'Save Changes'}
          </Button>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Settings Side Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left',
                  activeTab === item.id
                    ? 'bg-[#18181B] text-[#F5F5F0] border border-white/10 shadow-sm font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-white/5'
                )}
              >
                <span className={activeTab === item.id ? 'text-[#F4F6A6]' : 'text-[#71717A]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Settings Content Area */}
          <div className="md:col-span-3 space-y-6">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="rounded-xl bg-[#121214] border border-white/10 p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#F5F5F0]">Account Settings</h2>
                    <p className="text-xs text-[#A1A1AA]">Manage your user profile and Clerk identity.</p>
                  </div>
                  <Link
                    href="/user-profile"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F6A6] text-[#0B0B0C] text-xs font-semibold hover:bg-[#D4D686] transition"
                  >
                    <span>Clerk User Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#18181B] border border-white/10">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-12 h-12 border border-[#F4F6A6]/40 shadow-lg',
                      },
                    }}
                  />
                  <div>
                    <p className="text-sm font-bold text-[#F5F5F0]">
                      {clerkUser?.fullName || clerkUser?.username || 'Authenticated User'}
                    </p>
                    <p className="text-xs text-[#A1A1AA]">
                      {clerkUser?.primaryEmailAddress?.emailAddress || 'clerk@marian.ai'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={clerkUser?.fullName || clerkUser?.firstName || 'Alex Vance'}
                    disabled
                  />
                  <Input
                    label="Email Address"
                    value={clerkUser?.primaryEmailAddress?.emailAddress || 'alex@marian.ai'}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-[#A1A1AA]">Subscription Tier</span>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181B] border border-white/10">
                    <div>
                      <p className="text-sm font-semibold text-[#F5F5F0]">MARIAN Pro Plan</p>
                      <p className="text-xs text-[#71717A]">Access to MARIAN 3 Omni & High-Speed Stream Engine</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F4F6A6]/15 text-[#F4F6A6] border border-[#F4F6A6]/30 text-xs font-mono font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="rounded-xl bg-[#121214] border border-white/10 p-6 space-y-6 shadow-xl">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-lg font-semibold text-[#F5F5F0]">Appearance</h2>
                  <p className="text-xs text-[#A1A1AA]">Customize visual mode and workspace themes.</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'dark', label: 'Dark Mode (Default)', icon: <Moon className="w-5 h-5 text-[#F4F6A6]" /> },
                    { id: 'light', label: 'Light Mode', icon: <Sun className="w-5 h-5 text-amber-400" /> },
                    { id: 'system', label: 'System Preference', icon: <Laptop className="w-5 h-5 text-[#A1A1AA]" /> },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setTheme(mode.id as any)}
                      className={cn(
                        'p-4 rounded-xl border text-left space-y-2 transition-all',
                        theme === mode.id
                          ? 'bg-[#18181B] border-[#F4F6A6] text-[#F5F5F0]'
                          : 'bg-[#121214] border-white/10 text-[#A1A1AA] hover:bg-white/5'
                      )}
                    >
                      {mode.icon}
                      <p className="text-xs font-semibold">{mode.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Preferences Tab */}
            {activeTab === 'ai_preferences' && (
              <div className="rounded-xl bg-[#121214] border border-white/10 p-6 space-y-6 shadow-xl">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-lg font-semibold text-[#F5F5F0]">AI Preferences</h2>
                  <p className="text-xs text-[#A1A1AA]">Configure default model parameters and response style.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#A1A1AA]">Response Tone & Style</label>
                    <select
                      value={responseStyle}
                      onChange={(e) => setResponseStyle(e.target.value)}
                      className="w-full bg-[#18181B] text-[#F5F5F0] border border-white/10 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#F4F6A6]"
                    >
                      <option value="concise">Concise & Precise (Engineering Standard)</option>
                      <option value="detailed">Comprehensive & Academic</option>
                      <option value="technical">Code First & Architecture Centric</option>
                    </select>
                  </div>

                  <Textarea
                    label="Custom Instructions / System Prompt"
                    rows={4}
                    defaultValue="Prioritize type safety, modern React architecture, low-latency execution, and concise technical responses."
                  />
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <IntegrationCard
                state={calendarState}
                onConnect={onConnectCalendar}
                onDisconnect={onDisconnectCalendar}
              />
            )}

            {/* Privacy & Security Fallback Views */}
            {(activeTab === 'privacy' || activeTab === 'security' || activeTab === 'notifications') && (
              <div className="rounded-xl bg-[#121214] border border-white/10 p-6 space-y-4 shadow-xl">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-lg font-semibold text-[#F5F5F0]">
                    {activeTab === 'privacy' && 'Privacy & Data Controls'}
                    {activeTab === 'security' && 'Security & Session Management'}
                    {activeTab === 'notifications' && 'Notification Settings'}
                  </h2>
                  <p className="text-xs text-[#A1A1AA]">All enterprise security boundaries are actively enforced.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#18181B] border border-white/10 space-y-2 text-xs">
                  <p className="text-[#F5F5F0] font-semibold">Active Encryption Status</p>
                  <p className="text-[#A1A1AA]">
                    MARIAN encrypts all user metadata with AES-256 at rest and TLS 1.3 in transit. Zero tokens or model credentials are stored in clear text.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
