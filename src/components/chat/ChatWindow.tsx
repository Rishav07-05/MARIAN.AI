'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Message as MessageType, Conversation, ModelOption } from '@/types/chat';
import { AVAILABLE_MODELS } from '@/lib/chat';
import { Message } from './Message';
import { EmptyChat } from './EmptyChat';
import { ChatInput } from './ChatInput';
import { ChevronDown, Menu, ArrowDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  conversation: Conversation | undefined;
  messages: MessageType[];
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  onSendMessage: (content: string) => void;
  isStreaming: boolean;
  onStopGeneration: () => void;
  onOpenMobileSidebar?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  selectedModelId,
  onSelectModel,
  onSendMessage,
  isStreaming,
  onStopGeneration,
  onOpenMobileSidebar,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedModel = AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [conversation?.id]);

  useEffect(() => {
    if (isStreaming) {
      scrollToBottom('smooth');
    }
  }, [messages, isStreaming]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 150);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0B0B0C] relative">
      {/* Sticky Model Selector Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-[#0B0B0C]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121214] border border-white/10 text-xs font-semibold text-[#F5F5F0] hover:bg-[#18181B] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4F6A6]" />
              <span>{selectedModel.name}</span>
              {selectedModel.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F4F6A6]/10 text-[#F4F6A6]">
                  {selectedModel.badge}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
            </button>

            {modelDropdownOpen && (
              <div className="absolute top-11 left-0 w-72 bg-[#121214] border border-white/10 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                <div className="px-2 py-1 text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                  Select Inference Engine
                </div>
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setModelDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full text-left p-2.5 rounded-lg text-xs space-y-1 transition-colors',
                      selectedModelId === model.id
                        ? 'bg-[#18181B] border border-white/10 text-[#F5F5F0]'
                        : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{model.name}</span>
                      <span className="text-[10px] font-mono text-[#71717A]">
                        {model.contextWindow}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71717A] line-clamp-2">
                      {model.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Header Right Title Snippet */}
        {conversation && (
          <div className="hidden sm:block text-xs text-[#71717A] font-mono truncate max-w-xs">
            {conversation.title}
          </div>
        )}
      </header>

      {/* Message Feed / Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6"
      >
        {messages.length === 0 ? (
          <EmptyChat onSelectPrompt={(prompt) => onSendMessage(prompt)} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg) => (
              <Message
                key={msg.id}
                message={msg}
                onRegenerate={() => onSendMessage(messages[messages.length - 2]?.content || '')}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Scroll-to-bottom trigger */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 right-8 p-2 rounded-full bg-[#18181B] border border-white/10 text-[#F5F5F0] shadow-xl hover:bg-[#27272A] transition-all z-20"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* Chat Composer */}
      <ChatInput
        onSendMessage={(content) => onSendMessage(content)}
        isStreaming={isStreaming}
        onStopGeneration={onStopGeneration}
        selectedModelName={selectedModel.name}
      />
    </div>
  );
};
