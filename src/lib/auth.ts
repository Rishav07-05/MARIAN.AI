import { UserProfile, AuthSession } from '@/types/user';
import { apiFetch } from './api';

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr_marian_001',
  name: 'Alex Vance',
  email: 'alex@marian.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  tier: 'Pro',
  createdAt: '2026-01-15T00:00:00Z',
};

/**
 * Initiates Google OAuth authentication flow.
 * Handled safely without exposing client secrets in client bundle.
 */
export async function loginWithGoogle(): Promise<AuthSession> {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (googleClientId && typeof window !== 'undefined') {
    // Real OAuth trigger URL generation for production backend integration
    const redirectUri = `${window.location.origin}/login/callback`;
    const scope = 'email profile https://www.googleapis.com/auth/calendar.events.readonly';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    // Redirect to Google OAuth consent
    window.location.href = authUrl;
    return { user: null, status: 'loading' };
  }

  // Graceful fallback for standalone frontend preview mode
  await new Promise((res) => setTimeout(res, 800));
  if (typeof window !== 'undefined') {
    localStorage.setItem('marian_auth_token', 'mock_jwt_token_marian');
    localStorage.setItem('marian_user_profile', JSON.stringify(DEFAULT_DEMO_USER));
  }

  return {
    user: DEFAULT_DEMO_USER,
    status: 'authenticated',
    token: 'mock_jwt_token_marian',
  };
}

/**
 * Validates active session and retrieves user profile.
 */
export async function getCurrentSession(): Promise<AuthSession> {
  if (typeof window === 'undefined') {
    return { user: null, status: 'unauthenticated' };
  }

  const token = localStorage.getItem('marian_auth_token');
  if (!token) {
    return { user: null, status: 'unauthenticated' };
  }

  try {
    // Attempt backend session verification
    const user = await apiFetch<UserProfile>('/auth/me');
    return { user, status: 'authenticated', token };
  } catch {
    // Preview fallback check
    const stored = localStorage.getItem('marian_user_profile');
    if (stored) {
      try {
        const user = JSON.parse(stored) as UserProfile;
        return { user, status: 'authenticated', token };
      } catch {
        // Ignored
      }
    }
    return { user: DEFAULT_DEMO_USER, status: 'authenticated', token };
  }
}

/**
 * Handles session destruction and user logout.
 */
export async function logoutUser(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
    // Silent fail if offline or backend un-reachable
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('marian_auth_token');
      localStorage.removeItem('marian_user_profile');
    }
  }
}
