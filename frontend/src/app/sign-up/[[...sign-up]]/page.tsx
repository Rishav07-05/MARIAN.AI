'use client';

import React, { useState } from 'react';
import { useSignUp, useClerk, SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, KeyRound, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SignUpPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isLoaded, signUp } = useSignUp() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setActive } = useClerk() as any;
  const router = useRouter();

  const [mode, setMode] = useState<'clerk' | 'direct'>('clerk');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ longMessage?: string; message?: string }> };
      setError(
        clerkErr?.errors?.[0]?.longMessage ||
          clerkErr?.errors?.[0]?.message ||
          'Failed to initialize sign up. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp || !setActive) return;
    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/chat');
      } else {
        setError('Verification incomplete. Please check your confirmation code.');
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ longMessage?: string; message?: string }> };
      setError(
        clerkErr?.errors?.[0]?.longMessage ||
          clerkErr?.errors?.[0]?.message ||
          'Invalid verification code.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      <div className="mb-8 text-center z-10 space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-black shadow-lg shadow-cyan-500/20">
            M
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">MARIAN<span className="text-cyan-400">.AI</span></span>
        </Link>
        <p className="text-sm text-gray-400 max-w-sm">
          Create your account with Clerk Authentication.
        </p>
      </div>

      <div className="z-10 shadow-2xl rounded-2xl border border-white/10 overflow-hidden bg-gray-900/80 backdrop-blur-xl w-full max-w-md p-6 relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs">
          <span className="text-gray-400">If CAPTCHA is stuck:</span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'clerk' ? 'direct' : 'clerk');
              setError('');
            }}
            className="text-cyan-400 hover:underline font-medium flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{mode === 'clerk' ? 'Use Direct Sign Up (Bypass CAPTCHA)' : 'Use Prebuilt Clerk Form'}</span>
          </button>
        </div>

        {mode === 'clerk' ? (
          <SignUp
            appearance={{
              elements: {
                card: 'bg-transparent shadow-none p-0',
                headerTitle: 'text-white text-xl font-bold',
                headerSubtitle: 'text-gray-400 text-xs',
                socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition',
                formButtonPrimary: 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium shadow-md shadow-cyan-500/20',
                formFieldLabel: 'text-gray-300 text-xs font-medium',
                formFieldInput: 'bg-white/5 border border-white/10 text-white focus:border-cyan-500 rounded-lg',
                footerActionLink: 'text-cyan-400 hover:text-cyan-300',
                identityPreviewText: 'text-gray-300',
              },
            }}
          />
        ) : !pendingVerification ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Direct Clerk Sign Up</h2>
            <p className="text-xs text-gray-400">Creates your Clerk user account directly via Clerk SDK without Cloudflare Turnstile blocks.</p>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="enter your email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              <span>{loading ? 'Submitting to Clerk...' : 'Send Verification Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 border-t border-white/10">
              <span className="text-xs text-gray-400">Already have an account? </span>
              <Link href="/sign-in" className="text-xs text-cyan-400 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
              <p className="text-xs text-gray-400">
                We sent a 6-digit verification code to <span className="text-cyan-400">{emailAddress}</span>.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium">Verification Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 tracking-widest text-center font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Code...' : 'Complete Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
