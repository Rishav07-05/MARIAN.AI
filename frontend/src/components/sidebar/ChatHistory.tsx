import React from 'react';
import { Conversation } from '@/types/chat';
import { MessageSquare, Pin, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHistoryProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeId,
  onSelect,
  onTogglePin,
  onDelete,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="px-3 py-6 text-center text-xs text-[#71717A]">
        No conversations yet.
      </div>
    );
  }

  const pinnedList = conversations.filter((c) => c.isPinned);
  const recentList = conversations.filter((c) => !c.isPinned);

  return (
    <div className="space-y-4">
      {/* Pinned Section */}
      {pinnedList.length > 0 && (
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-mono font-medium text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
            <Pin className="w-3 h-3 text-[#F4F6A6]" />
            <span>Pinned</span>
          </div>
          {pinnedList.map((conv) => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeId}
              onSelect={onSelect}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Recent Section */}
      <div className="space-y-1">
        <div className="px-3 text-[11px] font-mono font-medium text-[#71717A] uppercase tracking-wider">
          Recent Conversations
        </div>
        {recentList.map((conv) => (
          <ConversationItem
            key={conv.id}
            conv={conv}
            isActive={conv.id === activeId}
            onSelect={onSelect}
            onTogglePin={onTogglePin}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

interface ConversationItemProps {
  conv: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conv,
  isActive,
  onSelect,
  onTogglePin,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onSelect(conv.id)}
      className={cn(
        'group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150',
        isActive
          ? 'bg-[#18181B] text-[#F5F5F0] border border-white/10 shadow-sm'
          : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-white/5'
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-6">
        <MessageSquare
          className={cn(
            'w-3.5 h-3.5 flex-shrink-0',
            isActive ? 'text-[#F4F6A6]' : 'text-[#71717A]'
          )}
        />
        <span className="truncate">{conv.title}</span>
      </div>

      {/* Action buttons on hover */}
      <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-[#18181B]/90 backdrop-blur-xs px-1 rounded transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(conv.id);
          }}
          className="p-1 text-[#71717A] hover:text-[#F4F6A6] transition-colors"
          title={conv.isPinned ? 'Unpin' : 'Pin conversation'}
        >
          <Pin className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(conv.id);
          }}
          className="p-1 text-[#71717A] hover:text-[#C6283D] transition-colors"
          title="Delete conversation"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
