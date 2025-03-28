'use client';

import { useSession } from 'next-auth/react';
import styles from '../../styles/Chat.module.css';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '../../lib/hooks/useChat';

export default function ChatComponent() {
  const { data: session } = useSession();
  const {
    messages,
    conversations,
    currentConversation,
    onlineUsers,
    isLoading,
    typing,
    connected,
    selectConversation,
    sendMessage,
    sendTypingIndicator,
  } = useChat();

  if (!session) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.chatPlaceholder}>
          Please log in to use the chat feature.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatSidebar}>
        <h2 className={styles.chatHeader}>
          Conversations
          {!connected && <span className={styles.offlineIndicator}> (Offline)</span>}
        </h2>
        <ConversationList
          conversations={conversations}
          currentUserId={session.user.id}
          onlineUsers={onlineUsers}
          onSelectConversation={selectConversation}
          currentConversation={currentConversation}
        />
      </div>

      <div className={styles.chatMain}>
        {currentConversation ? (
          <>
            <div className={styles.chatHeader}>
              <h2>
                {conversations.find(c => c.partnerId === currentConversation.partnerId)?.partnerName || "Chat"}
                {onlineUsers.includes(currentConversation.partnerId) && (
                  <span className={styles.onlineStatus}>Online</span>
                )}
                {typing[currentConversation.partnerId] && (
                  <span className={styles.typingIndicator}>typing...</span>
                )}
              </h2>
            </div>

            <MessageList
              messages={messages}
              currentUserId={session.user.id}
              isLoading={isLoading}
            />

            <MessageInput
              onSendMessage={sendMessage}
              onTyping={sendTypingIndicator}
              disabled={isLoading || !connected}
            />
          </>
        ) : (
          <div className={styles.chatPlaceholder}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
