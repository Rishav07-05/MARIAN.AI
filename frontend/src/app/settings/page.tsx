'use client';

import React, { useState, useEffect } from 'react';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import {
  getCalendarIntegrationStatus,
  connectGoogleCalendar,
  disconnectGoogleCalendar,
} from '@/lib/calendar';
import { CalendarIntegrationState } from '@/types/calendar';

export default function SettingsPage() {
  const [calendarState, setCalendarState] = useState<CalendarIntegrationState>({
    isConnected: false,
    permissions: ['view_events', 'create_events', 'update_events'],
    syncStatus: 'idle',
  });

  useEffect(() => {
    getCalendarIntegrationStatus().then(setCalendarState);
  }, []);

  const handleConnect = async () => {
    const updated = await connectGoogleCalendar([
      'view_events',
      'create_events',
      'update_events',
    ]);
    setCalendarState(updated);
  };

  const handleDisconnect = async () => {
    const updated = await disconnectGoogleCalendar();
    setCalendarState(updated);
  };

  return (
    <SettingsLayout
      calendarState={calendarState}
      onConnectCalendar={handleConnect}
      onDisconnectCalendar={handleDisconnect}
    />
  );
}
