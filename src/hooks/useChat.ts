import { useState, useRef, useCallback } from 'react';
import { Conversation, Message } from '@/types/chat';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES, AVAILABLE_MODELS, sendChatMessage } from '@/lib/chat';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [selectedModelId, setSelectedModelId] = useState<string>(AVAILABLE_MODELS[0].id);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeMessages = messagesMap[activeConversationId] || [];
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  /**
   * Creates a new conversation thread.
   */
  const createNewChat = useCallback(() => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      model: selectedModelId,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessagesMap((prev) => ({ ...prev, [newId]: [] }));
    setActiveConversationId(newId);
    return newId;
  }, [selectedModelId]);

  /**
   * Sends a user prompt and streams AI response.
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      let currentId = activeConversationId;
      const currentMsgs = messagesMap[currentId] || [];

      // Auto title assignment for new chats
      if (currentMsgs.length === 0) {
        const titleSnippet = content.trim().slice(0, 36) + (content.length > 36 ? '…' : '');
        setConversations((prev) =>
          prev.map((c) => (c.id === currentId ? { ...c, title: titleSnippet, snippet: content } : c))
        );
      }

      const userMsgId = `msg-${Date.now()}-u`;
      const aiMsgId = `msg-${Date.now()}-a`;
      const now = new Date().toISOString();

      const userMessage: Message = {
        id: userMsgId,
        conversationId: currentId,
        role: 'user',
        content,
        timestamp: now,
        status: 'complete',
      };

      const aiPlaceholderMessage: Message = {
        id: aiMsgId,
        conversationId: currentId,
        role: 'assistant',
        content: '',
        timestamp: now,
        status: 'streaming',
        modelUsed: AVAILABLE_MODELS.find((m) => m.id === selectedModelId)?.name || 'MARIAN 3 Omni',
      };

      // Update state with user message + empty streaming AI message
      setMessagesMap((prev) => ({
        ...prev,
        [currentId]: [...(prev[currentId] || []), userMessage, aiPlaceholderMessage],
      }));

      setIsStreaming(true);
      abortControllerRef.current = new AbortController();

      await sendChatMessage(
        currentId,
        content,
        selectedModelId,
        // Streaming chunk callback
        (delta) => {
          setMessagesMap((prev) => {
            const list = prev[currentId] || [];
            return {
              ...prev,
              [currentId]: list.map((msg) =>
                msg.id === aiMsgId ? { ...msg, content: msg.content + delta } : msg
              ),
            };
          });
        },
        // Stream completed callback
        (fullText) => {
          setIsStreaming(false);
          abortControllerRef.current = null;
          setMessagesMap((prev) => {
            const list = prev[currentId] || [];
            return {
              ...prev,
              [currentId]: list.map((msg) =>
                msg.id === aiMsgId ? { ...msg, content: fullText, status: 'complete' } : msg
              ),
            };
          });
        },
        // Stream error callback
        (err) => {
          setIsStreaming(false);
          abortControllerRef.current = null;
          setMessagesMap((prev) => {
            const list = prev[currentId] || [];
            return {
              ...prev,
              [currentId]: list.map((msg) =>
                msg.id === aiMsgId
                  ? {
                      ...msg,
                      content: msg.content || err.message,
                      status: 'error',
                    }
                  : msg
              ),
            };
          });
        },
        abortControllerRef.current.signal
      );
    },
    [activeConversationId, isStreaming, messagesMap, selectedModelId]
  );

  /**
   * Stops ongoing generation stream.
   */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    // Finalize current streaming message
    setMessagesMap((prev) => {
      const list = prev[activeConversationId] || [];
      return {
        ...prev,
        [activeConversationId]: list.map((msg) =>
          msg.status === 'streaming' ? { ...msg, status: 'complete' } : msg
        ),
      };
    });
  }, [activeConversationId]);

  /**
   * Toggles pinned state of conversation.
   */
  const togglePinConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  }, []);

  /**
   * Deletes a conversation.
   */
  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setMessagesMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (activeConversationId === id) {
        const remaining = conversations.filter((c) => c.id !== id);
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
        } else {
          createNewChat();
        }
      }
    },
    [activeConversationId, conversations, createNewChat]
  );

  return {
    conversations,
    activeConversationId,
    activeConversation,
    activeMessages,
    selectedModelId,
    isStreaming,
    setSelectedModelId,
    setActiveConversationId,
    createNewChat,
    sendMessage,
    stopGeneration,
    togglePinConversation,
    deleteConversation,
  };
}
