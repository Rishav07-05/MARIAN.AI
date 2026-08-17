'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarianLogo } from '@/components/ui/MarianLogo';
import { Button } from '@/components/ui/Button';
import { ChatHistory } from './ChatHistory';
import { Conversation } from '@/types/chat';
import { UserProfile } from '@/types/user';
import {
  Plus,
  Search,
  Settings,
  FolderKanban,
  Calendar,
  LogOut,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onTogglePin: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onTogglePin,
  onDeleteConversation,
  user,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B0B0C] border-r border-white/10 w-64 select-none">
      {/* Header & Logo */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center">
          <MarianLogo size={26} textClassName="text-sm font-semibold tracking-tight" />
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-[#71717A] hover:text-[#F5F5F0]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={() => {
            onNewChat();
            if (onCloseMobile) onCloseMobile();
          }}
          variant="primary"
          className="w-full justify-start gap-2 shadow-none text-xs font-semibold"
          leftIcon={<Plus className="w-4 h-4 text-[#0B0B0C]" />}
        >
          New Chat
        </Button>
      </div>

      {/* Search Input */}
      <div className="px-3 pb-2">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-[#121214] border border-white/10 text-xs text-[#F5F5F0] placeholder-[#71717A] rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#F4F6A6]/60 transition-colors"
          />
        </div>
      </div>

      {/* Conversation List Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
        <ChatHistory
          conversations={filteredConversations}
          activeId={activeId}
          onSelect={(id) => {
            onSelectConversation(id);
            if (onCloseMobile) onCloseMobile();
          }}
          onTogglePin={onTogglePin}
          onDelete={onDeleteConversation}
        />

        {/* Workspace section */}
        <div className="pt-3 border-t border-white/10 space-y-1">
          <div className="px-3 text-[11px] font-mono font-medium text-[#71717A] uppercase tracking-wider">
            Workspace
          </div>
          <a
            href="#projects"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Projects & Files</span>
          </a>
          <Link
            href="/settings/integrations"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#F4F6A6]" />
            <span className="flex-1">Google Calendar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </Link>
        </div>
      </div>

      {/* Footer / Settings & Profile */}
      <div className="p-3 border-t border-white/10 relative bg-[#0B0B0C]">
        {/* Profile menu popup */}
        {userMenuOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-[#121214] border border-white/10 rounded-xl shadow-xl p-1.5 space-y-1 z-30">
            <Link
              href="/settings"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#F5F5F0] hover:bg-white/5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Settings</span>
            </Link>
            <button
              onClick={() => {
                setUserMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#C6283D] hover:bg-[#C6283D]/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors flex-1 min-w-0 text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-[#F4F6A6]">
                  {user?.name ? user.name[0] : 'M'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#F5F5F0] truncate">
                {user?.name || 'Alex Vance'}
              </p>
              <p className="text-[10px] text-[#71717A] truncate font-mono">
                {user?.tier || 'Pro Plan'}
              </p>
            </div>
            <ChevronUp className="w-4 h-4 text-[#71717A]" />
          </button>

          <Link href="/settings">
            <button
              className="p-2 text-[#71717A] hover:text-[#F5F5F0] hover:bg-white/5 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-Out */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
