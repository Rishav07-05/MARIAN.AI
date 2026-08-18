'use client';

import React, { useState } from 'react';
import { CalendarIntegrationState } from '@/types/calendar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Calendar, CheckCircle2, AlertCircle, RefreshCw, Shield, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface IntegrationCardProps {
  state: CalendarIntegrationState;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  state,
  onConnect,
  onDisconnect,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    await onConnect();
    setIsLoading(false);
    setModalOpen(false);
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    await onDisconnect();
    setIsLoading(false);
  };

  return (
    <div className="rounded-xl bg-[#121214] border border-white/10 p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#18181B] border border-white/10 flex items-center justify-center text-[#F4F6A6] flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#F5F5F0]">Google Calendar</h3>
              {state.isConnected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#18181B] text-[#71717A] border border-white/10 text-[11px]">
                  Not Connected
                </span>
              )}
            </div>
            <p className="text-xs text-[#A1A1AA] max-w-lg leading-relaxed">
              Connect your calendar to let MARIAN understand your schedule, suggest focus blocks, and coordinate planning seamlessly.
            </p>
          </div>
        </div>

        <div>
          {state.isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              isLoading={isLoading}
              className="text-[#C6283D] border-[#C6283D]/30 hover:bg-[#C6283D]/10"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              leftIcon={<Calendar className="w-3.5 h-3.5 text-[#0B0B0C]" />}
            >
              Connect Google Calendar
            </Button>
          )}
        </div>
      </div>

      {/* Connection Details if Connected */}
      {state.isConnected && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#18181B] border border-white/10 rounded-xl p-4 text-xs">
            <div>
              <span className="text-[#71717A] block font-mono text-[11px]">Connected Account</span>
              <span className="text-[#F5F5F0] font-semibold">{state.connectedEmail || 'alex@marian.ai'}</span>
            </div>
            <div>
              <span className="text-[#71717A] block font-mono text-[11px]">Last Synchronization</span>
              <span className="text-[#F5F5F0]">
                {state.lastSyncAt ? formatRelativeTime(state.lastSyncAt) : 'Active'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">
              Granted Scopes & Permissions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { label: 'View calendar events', active: state.permissions.includes('view_events') },
                { label: 'Create new events', active: state.permissions.includes('create_events') },
                { label: 'Update schedule items', active: state.permissions.includes('update_events') },
              ].map((perm, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-[#18181B] border border-white/5 text-xs text-[#F5F5F0]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{perm.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Connect Google Calendar"
        description="Grant MARIAN read and write permissions to manage your schedule."
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 rounded-lg bg-[#18181B] border border-white/10 space-y-2 text-xs text-[#A1A1AA]">
            <div className="flex items-center gap-2 text-[#F5F5F0] font-semibold">
              <Shield className="w-4 h-4 text-[#F4F6A6]" />
              <span>Privacy & Permission Terms</span>
            </div>
            <p>MARIAN uses read-only access for event context and write access strictly when instructed by you.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnect}
              isLoading={isLoading}
            >
              Authorize & Connect
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
