'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message as MessageType } from '@/types/chat';
import { CodeBlock } from './CodeBlock';
import { TypingIndicator } from './TypingIndicator';
import {
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Edit2,
  Sparkles,
  User,
  Paperclip,
} from 'lucide-react';
import { formatRelativeTime, cn } from '@/lib/utils';
import { submitMessageFeedback } from '@/lib/chat';

interface MessageProps {
  message: MessageType;
  onRegenerate?: () => void;
  onEdit?: (content: string) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onRegenerate, onEdit }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [feedback, setFeedback] = useState<'thumbs_up' | 'thumbs_down' | null>(null);

  const isUser = message.role === 'user';
  const isStreaming = message.status === 'streaming';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFeedback = (rating: 'thumbs_up' | 'thumbs_down') => {
    setFeedback(rating);
    submitMessageFeedback({ messageId: message.id, rating });
  };

  return (
    <div
      className={cn(
        'group relative flex gap-4 p-4 md:p-6 rounded-2xl transition-colors',
        isUser
          ? 'bg-[#121214] border border-white/5 ml-auto max-w-3xl'
          : 'bg-transparent text-[#F5F5F0]'
      )}
    >
      {/* Avatar Icon */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center text-[#F5F5F0]">
            <User className="w-4 h-4 text-[#A1A1AA]" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#121214] border border-[#F4F6A6]/30 flex items-center justify-center text-[#F4F6A6] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#F4F6A6]" />
          </div>
        )}
      </div>

      {/* Message Content Container */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header line */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#F5F5F0]">
            {isUser ? 'You' : 'MARIAN.AI'}
          </span>
          {message.modelUsed && !isUser && (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#18181B] border border-white/10 text-[#F4F6A6]">
              {message.modelUsed}
            </span>
          )}
          <span className="text-[#71717A] text-[11px]">
            {formatRelativeTime(message.timestamp)}
          </span>
        </div>

        {/* Attachments if any */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181B] border border-white/10 text-xs text-[#A1A1AA]"
              >
                <Paperclip className="w-3.5 h-3.5 text-[#F4F6A6]" />
                <span className="truncate max-w-[150px]">{att.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message body / Streaming state */}
        {isStreaming && !message.content ? (
          <TypingIndicator />
        ) : (
          <div className="markdown-body prose prose-invert max-w-none text-sm leading-relaxed text-[#F5F5F0]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        value={codeString}
                      />
                    );
                  }

                  return (
                    <code
                      className="px-1.5 py-0.5 rounded bg-[#18181B] border border-white/10 font-mono text-xs text-[#F4F6A6]"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-xs text-left text-[#F5F5F0]">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="bg-[#121214] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA] border-b border-white/10">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return <td className="px-4 py-2 border-b border-white/5">{children}</td>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Action bar footer */}
        {!isStreaming && message.content && (
          <div className="pt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 rounded text-[#71717A] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
              title="Copy message"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {!isUser && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 rounded text-[#71717A] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
                title="Regenerate response"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            )}

            {!isUser && (
              <>
                <button
                  onClick={() => handleFeedback('thumbs_up')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    feedback === 'thumbs_up'
                      ? 'text-[#F4F6A6]'
                      : 'text-[#71717A] hover:text-[#F5F5F0] hover:bg-white/5'
                  )}
                  title="Good response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleFeedback('thumbs_down')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    feedback === 'thumbs_down'
                      ? 'text-[#C6283D]'
                      : 'text-[#71717A] hover:text-[#F5F5F0] hover:bg-white/5'
                  )}
                  title="Bad response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {isUser && onEdit && (
              <button
                onClick={() => onEdit(message.content)}
                className="p-1 rounded text-[#71717A] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
                title="Edit message"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
