import { useState, useRef, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Conversation, Message } from '@/types/chat';
import {
  AVAILABLE_MODELS,
  sendChatMessage,
  fetchConversationsApi,
  fetchMessagesApi,
  deleteConversationApi,
  migrateGuestHistoryApi,
} from '@/lib/chat';

const MAX_GUEST_MESSAGES = 5;

export function useChat() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [selectedModelId, setSelectedModelId] = useState<string>(AVAILABLE_MODELS[0].id);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [guestMessageCount, setGuestMessageCount] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Helper to generate valid UUID v4 string
   */
  const generateUuid = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  /**
   * Initialize guest message count from localStorage on client mount
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCount = localStorage.getItem('marian_guest_msg_count');
      if (storedCount) {
        setGuestMessageCount(parseInt(storedCount, 10) || 0);
      }
    }
  }, []);

  /**
   * Load user or guest conversations on initial mount / auth state change
   */
  useEffect(() => {
    let isMounted = true;

    if (isLoaded && isSignedIn) {
      // User is signed in: fetch real user history from backend
      fetchConversationsApi().then((serverConvs) => {
        if (!isMounted) return;

        // Check if there is guest history to migrate into logged-in user account
        let guestConvs: Conversation[] = [];
        let guestMsgs: Record<string, Message[]> = {};
        if (typeof window !== 'undefined') {
          const rawGuestHistory = localStorage.getItem('marian_guest_history');
          if (rawGuestHistory) {
            try {
              const parsed = JSON.parse(rawGuestHistory);
              guestConvs = parsed.conversations || [];
              guestMsgs = parsed.messagesMap || {};
              if (guestConvs.length > 0) {
                migrateGuestHistoryApi({ conversations: guestConvs, messagesMap: guestMsgs });
              }
              // Clear guest history buffer after capturing for user account
              localStorage.removeItem('marian_guest_history');
              localStorage.removeItem('marian_guest_msg_count');
            } catch {
              // Ignore JSON parse errors
            }
          }
        }

        // Merge server conversations with guest conversations
        const mergedConvs = [...guestConvs, ...serverConvs];

        if (mergedConvs.length > 0) {
          setConversations(mergedConvs);
          setMessagesMap((prev) => ({ ...guestMsgs, ...prev }));
          const firstId = mergedConvs[0].id;
          setActiveConversationId(firstId);
          fetchMessagesApi(firstId).then((msgs) => {
            if (isMounted) {
              setMessagesMap((prev) => ({ ...prev, [firstId]: msgs }));
            }
          });
        } else {
          const initialId = generateUuid();
          const initialConv: Conversation = {
            id: initialId,
            title: 'New Conversation',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPinned: false,
            model: selectedModelId,
          };
          setConversations([initialConv]);
          setActiveConversationId(initialId);
          setMessagesMap({ [initialId]: [] });
        }
      });
    } else if (isLoaded && !isSignedIn) {
      // Unauthenticated guest user: load guest history from localStorage if present
      let loadedConvs: Conversation[] = [];
      let loadedMsgs: Record<string, Message[]> = {};
      if (typeof window !== 'undefined') {
        const rawGuestHistory = localStorage.getItem('marian_guest_history');
        if (rawGuestHistory) {
          try {
            const parsed = JSON.parse(rawGuestHistory);
            loadedConvs = parsed.conversations || [];
            loadedMsgs = parsed.messagesMap || {};
          } catch {
            // Ignore
          }
        }
      }

      if (loadedConvs.length > 0) {
        setConversations(loadedConvs);
        setMessagesMap(loadedMsgs);
        setActiveConversationId(loadedConvs[0].id);
      } else {
        const initialId = generateUuid();
        const initialConv: Conversation = {
          id: initialId,
          title: 'New Conversation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPinned: false,
          model: selectedModelId,
        };
        setConversations([initialConv]);
        setActiveConversationId(initialId);
        setMessagesMap({ [initialId]: [] });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn]);

  /**
   * Fetch messages when active conversation changes if not loaded
   */
  useEffect(() => {
    if (!activeConversationId) return;
    if (!messagesMap[activeConversationId]) {
      fetchMessagesApi(activeConversationId).then((msgs) => {
        setMessagesMap((prev) => ({ ...prev, [activeConversationId]: msgs }));
      });
    }
  }, [activeConversationId]);

  const activeMessages = messagesMap[activeConversationId] || [];
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  /**
   * Creates a new conversation thread with a valid UUID.
   */
  const createNewChat = useCallback(() => {
    const newId = generateUuid();
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

      // Guest limit enforcement: 5 messages max without login
      if (!isSignedIn) {
        if (guestMessageCount >= MAX_GUEST_MESSAGES) {
          setShowAuthModal(true);
          return;
        }
        const nextCount = guestMessageCount + 1;
        setGuestMessageCount(nextCount);
        if (typeof window !== 'undefined') {
          localStorage.setItem('marian_guest_msg_count', nextCount.toString());
        }
      }

      const currentId = activeConversationId;
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
      const nextMessagesMap = {
        ...messagesMap,
        [currentId]: [...(messagesMap[currentId] || []), userMessage, aiPlaceholderMessage],
      };
      setMessagesMap(nextMessagesMap);

      // Save guest conversation history in localStorage for migration upon login
      if (!isSignedIn && typeof window !== 'undefined') {
        localStorage.setItem(
          'marian_guest_history',
          JSON.stringify({ conversations, messagesMap: nextMessagesMap })
        );
      }

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
            const updatedList = list.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: msg.content + delta } : msg
            );
            const updatedMap = { ...prev, [currentId]: updatedList };

            if (!isSignedIn && typeof window !== 'undefined') {
              localStorage.setItem(
                'marian_guest_history',
                JSON.stringify({ conversations, messagesMap: updatedMap })
              );
            }
            return updatedMap;
          });
        },
        // Stream completed callback
        (fullText) => {
          setIsStreaming(false);
          abortControllerRef.current = null;
          setMessagesMap((prev) => {
            const list = prev[currentId] || [];
            const updatedList: Message[] = list.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: fullText, status: 'complete' as const } : msg
            );
            const updatedMap = { ...prev, [currentId]: updatedList };

            if (!isSignedIn && typeof window !== 'undefined') {
              localStorage.setItem(
                'marian_guest_history',
                JSON.stringify({ conversations, messagesMap: updatedMap })
              );
            }
            return updatedMap;
          });
        },
        // Stream error callback
        (err) => {
          setIsStreaming(false);
          abortControllerRef.current = null;
          setMessagesMap((prev) => {
            const list = prev[currentId] || [];
            const updatedList: Message[] = list.map((msg) =>
              msg.id === aiMsgId
                ? {
                    ...msg,
                    content: msg.content || err.message,
                    status: 'error' as const,
                  }
                : msg
            );
            return { ...prev, [currentId]: updatedList };
          });
        },
        abortControllerRef.current.signal,
        // Callback when backend returns/assigns conversation UUID
        (serverConvId) => {
          if (serverConvId && serverConvId !== currentId) {
            setConversations((prev) =>
              prev.map((c) => (c.id === currentId ? { ...c, id: serverConvId } : c))
            );
            setMessagesMap((prev) => {
              const msgs = prev[currentId] || [];
              const next = { ...prev };
              delete next[currentId];
              next[serverConvId] = msgs;
              return next;
            });
            setActiveConversationId(serverConvId);
          }
        }
      );
    },
    [activeConversationId, isStreaming, messagesMap, selectedModelId, isSignedIn, guestMessageCount, conversations]
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
      deleteConversationApi(id);
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
    guestMessageCount,
    maxGuestMessages: MAX_GUEST_MESSAGES,
    showAuthModal,
    user,
    isSignedIn,
    setShowAuthModal,
    setSelectedModelId,
    setActiveConversationId,
    createNewChat,
    sendMessage,
    stopGeneration,
    togglePinConversation,
    deleteConversation,
  };
}
