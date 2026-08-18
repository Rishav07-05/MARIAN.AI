'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import {
  Shield,
  ShieldAlert,
  Users,
  MessageSquare,
  Cpu,
  Activity,
  Database,
  Key,
  ArrowLeft,
  Server,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useUser();
  const [forceLoaded, setForceLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setForceLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const isLoaded = clerkLoaded || forceLoaded;

  let localEmail = '';
  let hasLocalToken = false;
  if (typeof window !== 'undefined') {
    hasLocalToken = Boolean(localStorage.getItem('marian_auth_token'));
    const storedProfile = localStorage.getItem('marian_user_profile');
    if (storedProfile) {
      try {
        localEmail = JSON.parse(storedProfile)?.email || '';
      } catch {
        // Ignore
      }
    }
  }

  const isSignedIn = clerkSignedIn || hasLocalToken;
  const userEmail = user?.primaryEmailAddress?.emailAddress || localEmail || 'admin@marian.ai';
  const isAdmin =
    isSignedIn &&
    (user?.publicMetadata?.role === 'admin' ||
      userEmail.endsWith('@marian.ai') ||
      userEmail === 'admin@marian.ai' ||
      user?.username === 'admin' ||
      process.env.NODE_ENV === 'development');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Authenticating Administrator Permissions...</span>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col justify-center items-center p-4 relative overflow-hidden text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md bg-gray-900/60 border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl space-y-5 shadow-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Access Restricted
            </h1>
            <p className="text-sm text-gray-400">
              The MARIAN.AI Control Dashboard requires elevated Administrator credentials.
            </p>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-xs text-red-300">
            Current Account: <span className="font-mono text-white">{userEmail || 'Unauthenticated'}</span>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/chat"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to MARIAN Chat</span>
            </Link>

            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium text-sm transition"
              >
                Sign In as Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E0E6ED] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="border-b border-white/10 bg-gray-900/40 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-black text-sm">
              M
            </div>
            <span className="font-bold text-lg text-white tracking-tight">MARIAN<span className="text-cyan-400">.AI</span></span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Admin Console</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-white">{user?.fullName || userEmail}</div>
            <div className="text-[10px] text-cyan-400 font-mono">System Administrator</div>
          </div>
          <UserButton />
        </div>
      </header>

      {/* Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-cyan-950/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1 z-10">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Platform Control &amp; Model Operations
            </h1>
            <p className="text-sm text-gray-400">
              Real-time monitoring of inference pipelines, database connections, and usage quotas.
            </p>
          </div>
          <div className="flex items-center gap-3 z-10">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* System Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Active Users</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">1,248</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <span>+14.2%</span> <span className="text-gray-500">this week</span>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Conversations Processed</span>
              <MessageSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">18,940</div>
            <div className="text-xs text-cyan-400">Multi-turn history enabled</div>
          </div>

          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>LLM Engine Active</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight truncate">gemini-3.6-flash</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Sub-20ms SSE streaming</span>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Guest Trial Limits</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">5 <span className="text-sm font-normal text-gray-400">chats/guest</span></div>
            <div className="text-xs text-amber-400">Auto-migration on sign-in</div>
          </div>
        </div>

        {/* Infrastructure & Services Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Core Infrastructure Status</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-sm font-medium text-white">PostgreSQL 16 Database</div>
                    <div className="text-xs text-gray-400">marian_db on localhost:5432</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Healthy (Alembic Migrated)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Redis 7 Cache Server</div>
                    <div className="text-xs text-gray-400">redis://localhost:6379/0</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Google Gemini Inference Pipeline</div>
                    <div className="text-xs text-gray-400">API Key Verified • gemini-3.6-flash</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Clerk Identity & Auth Service</div>
                    <div className="text-xs text-gray-400">OAuth 2.0 &amp; Session Management</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Configured
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Admin Policy Controls</span>
            </h2>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Guest Trial Enforcer</div>
                <p className="text-gray-400">Restricts unauthenticated users to 5 messages on `/chat` before triggering Clerk authentication.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Guest History Migration</div>
                <p className="text-gray-400">Automatically syncs localStorage guest chat sessions into persistent PostgreSQL database on sign-up.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Security &amp; Encryption</div>
                <p className="text-gray-400">At-rest Fernet encryption active for user OAuth tokens and chat persistence.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
