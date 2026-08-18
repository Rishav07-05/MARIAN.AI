export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';

export interface Attachment {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  status: MessageStatus;
  tokenCount?: number;
  attachments?: Attachment[];
  isEdited?: boolean;
  modelUsed?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  model: string;
  snippet?: string;
  folder?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
  contextWindow: string;
  isDefault?: boolean;
  recommendedFor: string;
}

export interface StreamToken {
  id: string;
  conversationId: string;
  delta: string;
  done: boolean;
  error?: string;
}

export interface MessageFeedback {
  messageId: string;
  rating: 'thumbs_up' | 'thumbs_down';
  feedbackText?: string;
}
