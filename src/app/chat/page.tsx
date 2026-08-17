'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';

export default function ChatPage() {
  const {
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
  } = useChat();

  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0B0C]">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={createNewChat}
        onTogglePin={togglePinConversation}
        onDeleteConversation={deleteConversation}
        user={user}
        onLogout={logout}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Chat Workspace */}
      <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
        selectedModelId={selectedModelId}
        onSelectModel={setSelectedModelId}
        onSendMessage={sendMessage}
        isStreaming={isStreaming}
        onStopGeneration={stopGeneration}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      />
    </div>
  );
}
