'use client';

import { useEffect, useRef } from 'react';
import styles from '../../styles/Chat.module.css';

export default function MessageList({ messages, currentUserId, isLoading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (isLoading) {
    return <div className={styles.messagesLoading}>Loading messages...</div>;
  }

  return (
    <div className={styles.messageList}>
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className={styles.messageGroup}>
          <div className={styles.messageDateSeparator}>
            <span>{date}</span>
          </div>

          {dateMessages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageItem} ${
                message.senderId === currentUserId ? styles.outgoingMessage : styles.incomingMessage
              }`}
            >
              <div className={styles.messageContent}>
                {message.message}
                <span className={styles.messageTime}>
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
