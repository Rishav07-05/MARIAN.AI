export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  tier: 'Starter' | 'Pro' | 'Enterprise';
  createdAt: string;
}

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export interface AuthSession {
  user: UserProfile | null;
  status: AuthStatus;
  token?: string;
  expiresAt?: string;
  error?: string | null;
}

export interface UserPreferences {
  theme: ThemeMode;
  defaultModel: string;
  responseStyle: 'concise' | 'detailed' | 'technical' | 'creative';
  temperature: number;
  memoryEnabled: boolean;
  streamResponses: boolean;
  emailNotifications: boolean;
  securityAlerts: boolean;
}
