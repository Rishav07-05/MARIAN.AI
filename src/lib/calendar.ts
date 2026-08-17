import { CalendarIntegrationState, CalendarPermission } from '@/types/calendar';
import { apiFetch } from './api';

const MOCK_CONNECTED_STATE: CalendarIntegrationState = {
  isConnected: true,
  connectedEmail: 'alex@marian.ai',
  connectedAt: '2026-02-10T14:30:00Z',
  permissions: ['view_events', 'create_events', 'update_events'],
  syncStatus: 'idle',
  lastSyncAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
};

const MOCK_DISCONNECTED_STATE: CalendarIntegrationState = {
  isConnected: false,
  permissions: ['view_events', 'create_events', 'update_events'],
  syncStatus: 'idle',
};

/**
 * Retrieves Google Calendar integration status.
 */
export async function getCalendarIntegrationStatus(): Promise<CalendarIntegrationState> {
  try {
    const list = await apiFetch<Array<{ provider: string; provider_account_id: string; status: string }>>('/integrations');
    const google = list.find((item) => item.provider === 'google_calendar');
    if (google && google.status === 'active') {
      return {
        isConnected: true,
        connectedEmail: google.provider_account_id,
        connectedAt: new Date().toISOString(),
        permissions: ['view_events', 'create_events', 'update_events'],
        syncStatus: 'idle',
      };
    }
    return MOCK_DISCONNECTED_STATE;
  } catch {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('marian_calendar_connected');
      if (stored === 'true') {
        return MOCK_CONNECTED_STATE;
      }
    }
    return MOCK_DISCONNECTED_STATE;
  }
}

/**
 * Initiates connection process to Google Calendar.
 */
export async function connectGoogleCalendar(permissions: CalendarPermission[]): Promise<CalendarIntegrationState> {
  try {
    const res = await apiFetch<{ authorization_url?: string }>('/integrations/google/connect', {
      method: 'POST',
      body: JSON.stringify({ permissions }),
    });
    if (res.authorization_url && typeof window !== 'undefined') {
      // In real OAuth flow, redirect to authorization consent URL
      window.location.href = res.authorization_url;
    }
    return MOCK_CONNECTED_STATE;
  } catch {
    await new Promise((res) => setTimeout(res, 600));
    if (typeof window !== 'undefined') {
      localStorage.setItem('marian_calendar_connected', 'true');
    }
    return {
      ...MOCK_CONNECTED_STATE,
      permissions,
      connectedAt: new Date().toISOString(),
    };
  }
}

/**
 * Disconnects Google Calendar integration.
 */
export async function disconnectGoogleCalendar(): Promise<CalendarIntegrationState> {
  try {
    await apiFetch('/integrations/google', {
      method: 'DELETE',
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('marian_calendar_connected', 'false');
    }
    return MOCK_DISCONNECTED_STATE;
  } catch {
    await new Promise((res) => setTimeout(res, 400));
    if (typeof window !== 'undefined') {
      localStorage.setItem('marian_calendar_connected', 'false');
    }
    return MOCK_DISCONNECTED_STATE;
  }
}
