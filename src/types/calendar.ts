export type CalendarPermission =
  | 'view_events'
  | 'create_events'
  | 'update_events';

export interface CalendarIntegrationState {
  isConnected: boolean;
  connectedEmail?: string;
  connectedAt?: string;
  permissions: CalendarPermission[];
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  lastSyncAt?: string;
  errorMessage?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: string; // ISO date string
  end: string;   // ISO date string
  location?: string;
  attendeesCount?: number;
  status: 'confirmed' | 'tentative' | 'cancelled';
}
