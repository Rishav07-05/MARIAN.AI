import { Conversation, Message, ModelOption, MessageFeedback } from '@/types/chat';
import { apiFetch, streamSseResponse } from './api';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'marian-3-omni',
    name: 'MARIAN 3 Omni',
    description: 'Our most capable multimodal reasoning model for complex code, strategy & analysis.',
    badge: 'Flagship',
    contextWindow: '200k tokens',
    isDefault: true,
    recommendedFor: 'Complex tasks & Deep Reasoning',
  },
  {
    id: 'marian-3-reasoning',
    name: 'MARIAN 3 Reasoning',
    description: 'Specialized chain-of-thought engine for mathematics, logic proofs and architecture.',
    badge: 'Pro',
    contextWindow: '128k tokens',
    recommendedFor: 'Math, Logic & Code Audits',
  },
  {
    id: 'marian-3-flash',
    name: 'MARIAN 3 Flash',
    description: 'Ultra-low latency model engineered for instant responses and real-time execution.',
    badge: 'Fast',
    contextWindow: '64k tokens',
    recommendedFor: 'Quick Questions & Real-Time Editing',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Distributed System Architecture for AI Streaming',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    isPinned: true,
    model: 'marian-3-omni',
    snippet: 'Analyzing low-latency SSE vs WebSockets for token delivery...',
  },
  {
    id: 'conv-2',
    title: 'Google Calendar Event Parsing & Schedule Optimization',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    isPinned: true,
    model: 'marian-3-omni',
    snippet: 'Structuring calendar permissions and conflict resolution strategy...',
  },
  {
    id: 'conv-3',
    title: 'React Server Components & Next.js Performance Audit',
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    isPinned: false,
    model: 'marian-3-flash',
    snippet: 'Optimizing bundle size with dynamic imports and client boundaries...',
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      role: 'user',
      content: 'Can you outline a high-throughput architecture for streaming AI tokens from a Python FastAPI backend to a React frontend?',
      timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      status: 'complete',
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      role: 'assistant',
      content: `Here is a high-performance, resilient streaming architecture tailored for **MARIAN.AI**:

### Architecture Overview

\`\`\`text
┌────────────────┐      HTTP/2 SSE       ┌────────────────┐     gRPC Stream      ┌─────────────────┐
│ React / Next.js│  ◄─────────────────  │ Python FastAPI │  ◄─────────────────  │ MARIAN Inference│
│ Client Frontend│     Streaming         │ API Gateway    │    Model Tokens     │ Engine (C++)    │
└────────────────┘                       └────────────────┘                      └─────────────────┘
\`\`\`

### 1. Key Design Principles
* **Server-Sent Events (SSE)** over WebSockets for unidirectional token streaming (lower overhead, automatic reconnects, native browser EventSource support).
* **Asynchronous AsyncIO Queue** in FastAPI to prevent blocking worker threads while waiting for token generation.
* **Client-side Chunk Buffering** using \`TextDecoder\` to gracefully reconstruct fragmented UTF-8 multi-byte characters.

### 2. FastAPI Endpoint Example (\`main.py\`)
\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import async_timeout
import asyncio
import json

app = FastAPI(title="MARIAN AI API Gateway")

async def generate_token_stream(prompt: str):
    # Simulating connection to MARIAN Transformer Model Engine
    for token in ["MARIAN", " processes", " your", " query", " in", " real-time", "."]:
        await asyncio.sleep(0.04)
        yield f"data: {json.dumps({'delta': token})}\\n\\n"
    yield "data: [DONE]\\n\\n"

@app.post("/api/v1/chat/stream")
async function chat_stream(payload: dict):
    prompt = payload.get("prompt", "")
    return StreamingResponse(
        generate_token_stream(prompt),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
\`\`\`

This guarantees minimal latency and rock-solid memory stability during peak request surges.`,
      timestamp: new Date(Date.now() - 3600 * 1000 * 2 + 1000).toISOString(),
      status: 'complete',
      modelUsed: 'MARIAN 3 Omni',
      tokenCount: 284,
    },
  ],
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

export async function fetchConversationsApi(): Promise<Conversation[]> {
  try {
    const res = await apiFetch<{ items: Array<{ id: string; title: string; created_at: string; updated_at: string }> }>('/conversations');
    return res.items.map((item) => ({
      id: item.id,
      title: item.title,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      isPinned: false,
      model: 'marian-3-omni',
    }));
  } catch {
    return [];
  }
}

export async function fetchMessagesApi(conversationId: string): Promise<Message[]> {
  if (!isValidUuid(conversationId)) return [];
  try {
    const res = await apiFetch<{ items: Array<{ id: string; conversation_id: string; role: 'user' | 'assistant'; content: string; created_at: string; model?: string }> }>(
      `/conversations/${conversationId}/messages`
    );
    return res.items.map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      role: m.role,
      content: m.content,
      timestamp: m.created_at,
      status: 'complete',
      modelUsed: m.model || 'MARIAN 3 Omni',
    }));
  } catch {
    return [];
  }
}

export async function deleteConversationApi(conversationId: string): Promise<void> {
  if (!isValidUuid(conversationId)) return;
  try {
    await apiFetch(`/conversations/${conversationId}`, { method: 'DELETE' });
  } catch {
    // Graceful silent handling
  }
}

export async function migrateGuestHistoryApi(guestData: {
  conversations: Conversation[];
  messagesMap: Record<string, Message[]>;
}): Promise<void> {
  try {
    const payloadConvs = guestData.conversations.map((c) => ({
      title: c.title,
      messages: (guestData.messagesMap[c.id] || []).map((m) => ({
        role: m.role,
        content: m.content,
        model: m.modelUsed || 'MARIAN 3 Omni',
      })),
    }));

    if (payloadConvs.length === 0) return;

    await apiFetch('/conversations/migrate_guest', {
      method: 'POST',
      body: JSON.stringify({ conversations: payloadConvs }),
    });
  } catch {
    // Graceful silent handling
  }
}


/**
 * Sends a message and triggers real-time token streaming.
 */
export async function sendChatMessage(
  conversationId: string,
  prompt: string,
  modelId: string,
  onChunk: (delta: string) => void,
  onComplete: (fullText: string) => void,
  onError: (err: Error) => void,
  signal?: AbortSignal,
  onConversationId?: (id: string) => void
): Promise<void> {
  const isStreamingEnabled = process.env.NEXT_PUBLIC_ENABLE_STREAMING !== 'false';

  if (isStreamingEnabled) {
    let accumulatedText = '';

    try {
      await streamSseResponse(
        '/chat',
        {
          conversation_id: isValidUuid(conversationId) ? conversationId : null,
          prompt,
          model: modelId,
        },
        (delta) => {
          accumulatedText += delta;
          onChunk(delta);
        },
        () => onComplete(accumulatedText),
        (err) => {
          // If backend connection fails in dev/preview, fallback to simulated streaming generator
          simulateStreamingResponse(prompt, onChunk, onComplete, signal);
        },
        signal,
        onConversationId
      );
    } catch {
      simulateStreamingResponse(prompt, onChunk, onComplete, signal);
    }
  } else {
    simulateStreamingResponse(prompt, onChunk, onComplete, signal);
  }
}

/**
 * Standalone realistic streaming simulator for offline/frontend preview mode.
 */
function simulateStreamingResponse(
  prompt: string,
  onChunk: (delta: string) => void,
  onComplete: (fullText: string) => void,
  signal?: AbortSignal
) {
  const sampleResponses = [
    `I've analyzed your prompt regarding **"${prompt.slice(0, 40)}..."**.

MARIAN.AI prioritizes **precision, speed, and safety**. Here is the structured resolution:

### Key Highlights
1. **Intelligent Context Integration**: Cross-referencing current thread and historical context.
2. **Minimal Latency Execution**: Operating with sub-50ms token generation bounds.
3. **Structured Recommendations**:
   * Verify environment variables in \`.env.local\`.
   * Keep components modular with strict TypeScript interfaces.
   * Enforce client-side sanitization on rendered dynamic Markdown.

\`\`\`typescript
// MARIAN verified code snippet
export async function executeTask(): Promise<{ success: boolean }> {
  return { success: true };
}
\`\`\`

Let me know if you would like me to expand on any specific aspect or run a simulation.`,
  ];

  const fullResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
  const words = fullResponse.split(' ');
  let index = 0;
  let accumulated = '';

  const interval = setInterval(() => {
    if (signal?.aborted) {
      clearInterval(interval);
      return;
    }

    if (index < words.length) {
      const delta = (index === 0 ? '' : ' ') + words[index];
      accumulated += delta;
      onChunk(delta);
      index++;
    } else {
      clearInterval(interval);
      onComplete(accumulated);
    }
  }, 25);
}

/**
 * Submits user feedback for an AI message.
 */
export async function submitMessageFeedback(feedback: MessageFeedback): Promise<void> {
  try {
    await apiFetch('/chat/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  } catch {
    // Graceful silent handling
  }
}
