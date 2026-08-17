'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Square,
  Paperclip,
  Mic,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { estimateTokenCount, formatBytes } from '@/lib/utils';
import { Attachment } from '@/types/chat';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  isStreaming: boolean;
  onStopGeneration: () => void;
  selectedModelName?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
  onStopGeneration,
  selectedModelName = 'MARIAN 3 Omni',
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto grow textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!input.trim() && attachments.length === 0) || isStreaming) return;
    onSendMessage(input, attachments);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newAttachments: Attachment[] = files.map((file) => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type || 'document',
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const estimatedTokens = estimateTokenCount(input);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      <div className="relative rounded-2xl bg-[#121214] border border-white/10 shadow-2xl p-3 focus-within:border-[#F4F6A6]/50 transition-colors">
        {/* Attachment chips if added */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2 mb-2 border-b border-white/5 px-1">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#18181B] border border-white/10 text-xs text-[#F5F5F0]"
              >
                <FileText className="w-3.5 h-3.5 text-[#F4F6A6]" />
                <span className="truncate max-w-[140px]">{att.name}</span>
                <span className="text-[10px] text-[#71717A]">{formatBytes(att.size)}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="text-[#71717A] hover:text-[#C6283D] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Multiline Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask MARIAN anything..."
          rows={1}
          disabled={isStreaming}
          className="w-full bg-transparent text-[#F5F5F0] placeholder-[#71717A] text-sm focus:outline-none resize-none min-h-[36px] max-h-[200px] leading-relaxed py-1 px-1"
        />

        {/* Toolbar & Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1 text-xs">
          <div className="flex items-center gap-2">
            {/* Attachment trigger */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
              title="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Voice input placeholder button */}
            <button
              onClick={() => alert('Voice input module will interface with browser Web Speech API / MARIAN Voice Backend.')}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
              title="Voice Input (Preview)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <div className="h-3 w-px bg-white/10 mx-1" />

            {/* Active Model & Token counter */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] font-mono">
              <Sparkles className="w-3 h-3 text-[#F4F6A6]" />
              <span>{selectedModelName}</span>
              {input.length > 0 && (
                <span className="text-[#A1A1AA] font-mono ml-2">
                  ~{estimatedTokens} tokens
                </span>
              )}
            </div>
          </div>

          {/* Send / Stop button */}
          <div>
            {isStreaming ? (
              <button
                onClick={onStopGeneration}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C6283D] text-white text-xs font-medium hover:bg-[#A81F31] transition-colors"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim() && attachments.length === 0}
                className="p-2 rounded-xl bg-[#F4F6A6] text-[#0B0B0C] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#E9EB88] transition-all duration-150 shadow-sm"
                title="Send message (Enter)"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-center text-[#71717A] mt-2 font-mono">
        MARIAN.AI v3.4 • Press Enter to send, Shift + Enter for newline
      </p>
    </div>
  );
};
