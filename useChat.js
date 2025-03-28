'use client';

import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export function useChat() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typing, setTyping] = useState({});
  const [connected, setConnected] = useState(false);

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setIsLoading(false);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!session?.user?.id) return;

    // Connect to Socket.io server
    const socketIo = io('', {
      path: '/api/socket',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketIo.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);

      // Join with user ID
      socketIo.emit('join', { userId: session.user.id });
    });

    socketIo.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setConnected(false);
    });

    socketIo.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [session]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    // Listen for online users list
    socket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    // Listen for user status changes
    socket.on('user_status', ({ userId, status }) => {
      if (status === 'online') {
        setOnlineUsers(prev => [...prev, userId]);
      } else {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      }
    });

    // Listen for new messages
    socket.on('new_message', (message) => {
      // Add message to the current conversation if it belongs there
      if (currentConversation &&
          (message.senderId === currentConversation.partnerId ||
           message.receiverId === currentConversation.partnerId)) {
        setMessages(prev => [...prev, message]);

        // Mark the message as read if it's from the current conversation partner
        if (message.senderId === currentConversation.partnerId) {
          socket.emit('mark_as_read', { messageIds: [message.id] });
        }
      } else {
        // Update unread count
        setUnreadCount(prev => prev + 1);
      }

      // Fetch conversations to update the list
      fetchConversations();
    });

    // Listen for message history
    socket.on('message_history', (messagesHistory) => {
      setMessages(messagesHistory);
      setIsLoading(false);
    });

    // Listen for unread count
    socket.on('unread_count', (count) => {
      setUnreadCount(count);
    });

    // Listen for typing indicator
    socket.on('user_typing', ({ userId, isTyping }) => {
      setTyping(prev => ({
        ...prev,
        [userId]: isTyping
      }));

      // Auto-clear typing indicator after 3 seconds
      if (isTyping) {
        setTimeout(() => {
          setTyping(prev => ({
            ...prev,
            [userId]: false
          }));
        }, 3000);
      }
    });

    // Clean up on unmount
    return () => {
      socket.off('online_users');
      socket.off('user_status');
      socket.off('new_message');
      socket.off('message_history');
      socket.off('unread_count');
      socket.off('user_typing');
    };
  }, [socket, session, currentConversation, fetchConversations]);

  // Initial fetch of conversations
  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations();
    }
  }, [session, fetchConversations]);

  // Select a conversation
  const selectConversation = useCallback((conversation) => {
    setCurrentConversation(conversation);
    setIsLoading(true);

    if (socket && conversation) {
      // Request message history for this conversation
      socket.emit('get_messages', { otherUserId: conversation.partnerId });

      // Mark messages from this conversation as read
      fetch('/api/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_read',
          otherUserId: conversation.partnerId,
        }),
      }).then(() => {
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - conversation.unreadCount));
      });
    }
  }, [socket]);

  // Send a message
  const sendMessage = useCallback((text) => {
    if (!socket || !currentConversation || !text.trim() || !session?.user?.id) return;

    socket.emit('private_message', {
      receiverId: currentConversation.partnerId,
      message: text,
      senderName: session.user.name,
    });
  }, [socket, currentConversation, session]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    if (!socket || !currentConversation) return;

    socket.emit('typing', {
      receiverId: currentConversation.partnerId,
      isTyping,
    });
  }, [socket, currentConversation]);

  return {
    messages,
    conversations,
    currentConversation,
    onlineUsers,
    isLoading,
    unreadCount,
    typing,
    connected,
    selectConversation,
    sendMessage,
    sendTypingIndicator,
    refreshConversations: fetchConversations,
  };
}
