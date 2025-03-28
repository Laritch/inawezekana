'use client';

import { useState, useEffect } from 'react';
import { getUserById } from '../../lib/auth-options';
import styles from '../../styles/Chat.module.css';

export default function ConversationList({
  conversations,
  currentUserId,
  onlineUsers,
  onSelectConversation,
  currentConversation
}) {
  const [conversationsWithPartners, setConversationsWithPartners] = useState([]);

  useEffect(() => {
    // Add partner details to conversations
    const enhancedConversations = conversations.map(convo => {
      const partner = getUserById(convo.partnerId);
      return {
        ...convo,
        partnerName: partner?.name || 'Unknown User',
        partnerRole: partner?.role || 'unknown'
      };
    });

    setConversationsWithPartners(enhancedConversations);
  }, [conversations]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today, return time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week, return day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // More than a week ago, return date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateMessage = (message, maxLength = 30) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div className={styles.conversationList}>
      {conversationsWithPartners.length === 0 ? (
        <div className={styles.noConversations}>
          No conversations yet
        </div>
      ) : (
        conversationsWithPartners.map(convo => (
          <div
            key={convo.partnerId}
            className={`${styles.conversationItem} ${
              currentConversation?.partnerId === convo.partnerId ? styles.activeConversation : ''
            }`}
            onClick={() => onSelectConversation(convo)}
          >
            <div className={styles.conversationAvatar}>
              {convo.partnerName ? convo.partnerName[0].toUpperCase() : 'U'}
              {onlineUsers.includes(convo.partnerId) && (
                <span className={styles.onlineDot}></span>
              )}
            </div>

            <div className={styles.conversationInfo}>
              <div className={styles.conversationHeader}>
                <span className={styles.conversationName}>
                  {convo.partnerName}
                </span>
                <span className={styles.conversationTime}>
                  {formatTime(convo.latestMessage.timestamp)}
                </span>
              </div>

              <div className={styles.conversationMessage}>
                {convo.latestMessage.senderId === currentUserId ? (
                  <span className={styles.outgoingIndicator}>You: </span>
                ) : null}
                {truncateMessage(convo.latestMessage.message)}
              </div>

              {convo.unreadCount > 0 && (
                <span className={styles.unreadBadge}>
                  {convo.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
