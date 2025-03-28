import { Server as SocketIOServer } from 'socket.io';

// In-memory message storage for demo purposes
// In production, these would be stored in a database
let messages = [
  {
    id: 'm1',
    senderId: '1', // client
    receiverId: '2', // expert
    senderName: 'Client Demo',
    message: 'Hello, I have a question about heart health.',
    timestamp: new Date(Date.now() - 60000 * 10).toISOString(), // 10 minutes ago
    read: true
  },
  {
    id: 'm2',
    senderId: '2', // expert
    receiverId: '1', // client
    senderName: 'Expert Demo',
    message: 'Hi there! I\'d be happy to help with your heart health questions. What would you like to know?',
    timestamp: new Date(Date.now() - 60000 * 9).toISOString(), // 9 minutes ago
    read: true
  },
  {
    id: 'm3',
    senderId: '1', // client
    receiverId: '4', // expert
    senderName: 'Client Demo',
    message: 'I\'ve been feeling anxious lately. Do you have any recommendations?',
    timestamp: new Date(Date.now() - 60000 * 30).toISOString(), // 30 minutes ago
    read: true
  },
  {
    id: 'm4',
    senderId: '4', // expert
    receiverId: '1', // client
    senderName: 'Dr. Sarah Johnson',
    message: 'I understand how difficult anxiety can be. Let\'s discuss some strategies that might help you manage it.',
    timestamp: new Date(Date.now() - 60000 * 29).toISOString(), // 29 minutes ago
    read: false
  },
  {
    id: 'm5',
    senderId: '1', // client
    receiverId: '2', // expert
    senderName: 'Client Demo',
    message: 'I\'ve been experiencing chest pain occasionally. Is this something I should be concerned about?',
    timestamp: new Date(Date.now() - 60000 * 5).toISOString(), // 5 minutes ago
    read: false
  }
];

// Keep track of active connections
const connectedUsers = new Map();

let io;

export function getSocketIOInstance() {
  return io;
}

export function initSocketServer(server) {
  if (io) return io;

  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/api/socket',
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    let userId = null;

    // When user joins with their ID
    socket.on('join', (data) => {
      userId = data.userId;
      if (userId) {
        console.log(`User ${userId} joined`);

        // Store socket connection with user ID
        connectedUsers.set(userId, socket.id);

        // Broadcast to others that user is online
        socket.broadcast.emit('user_status', { userId, status: 'online' });

        // Send list of online users to the newly connected user
        const onlineUsers = Array.from(connectedUsers.keys());
        socket.emit('online_users', onlineUsers);

        // Get unread messages count
        const unreadMessages = messages.filter(
          msg => msg.receiverId === userId && !msg.read
        ).length;

        socket.emit('unread_count', unreadMessages);
      }
    });

    // Handle private messages
    socket.on('private_message', (data) => {
      const { receiverId, message } = data;

      if (!userId || !receiverId || !message) {
        return socket.emit('error', { message: 'Invalid message data' });
      }

      const timestamp = new Date().toISOString();
      const newMessage = {
        id: `m${messages.length + 1}`,
        senderId: userId,
        receiverId,
        senderName: data.senderName || 'Unknown User',
        message,
        timestamp,
        read: false
      };

      // Save message to "database"
      messages.push(newMessage);

      // Send to sender (acknowledgment)
      socket.emit('message_sent', newMessage);

      // Send to receiver if online
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', newMessage);
      }
    });

    // Handle message history request
    socket.on('get_messages', (data) => {
      const { otherUserId } = data;

      if (!userId || !otherUserId) {
        return socket.emit('error', { message: 'Invalid user IDs' });
      }

      // Get messages between these two users
      const userMessages = messages.filter(
        msg => (msg.senderId === userId && msg.receiverId === otherUserId) ||
               (msg.senderId === otherUserId && msg.receiverId === userId)
      );

      // Mark messages as read
      messages = messages.map(msg => {
        if (msg.senderId === otherUserId && msg.receiverId === userId && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });

      // Sort by timestamp
      userMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      socket.emit('message_history', userMessages);
    });

    // Handle marking messages as read
    socket.on('mark_as_read', (data) => {
      const { messageIds } = data;

      if (!Array.isArray(messageIds) || !userId) {
        return socket.emit('error', { message: 'Invalid request' });
      }

      // Mark messages as read
      messages = messages.map(msg => {
        if (messageIds.includes(msg.id) && msg.receiverId === userId) {
          return { ...msg, read: true };
        }
        return msg;
      });

      socket.emit('messages_marked_read', messageIds);
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;

      if (!userId || !receiverId) {
        return socket.emit('error', { message: 'Invalid user IDs' });
      }

      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { userId, isTyping });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected, userId: ${userId}`);

      if (userId) {
        // Remove from connected users
        connectedUsers.delete(userId);

        // Broadcast to others that user is offline
        socket.broadcast.emit('user_status', { userId, status: 'offline' });
      }
    });
  });

  return io;
}

// Function to get all messages for a user
export function getUserMessages(userId) {
  if (!userId) return [];

  return messages.filter(
    msg => msg.senderId === userId || msg.receiverId === userId
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Function to get conversation between two users
export function getConversation(userId1, userId2) {
  if (!userId1 || !userId2) return [];

  return messages.filter(
    msg => (msg.senderId === userId1 && msg.receiverId === userId2) ||
           (msg.senderId === userId2 && msg.receiverId === userId1)
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Function to get all conversations for a user
export function getUserConversations(userId) {
  if (!userId) return [];

  // Get all messages for this user
  const userMessages = messages.filter(
    msg => msg.senderId === userId || msg.receiverId === userId
  );

  // Get unique conversation partners
  const conversationPartners = new Set();
  userMessages.forEach(msg => {
    if (msg.senderId === userId) {
      conversationPartners.add(msg.receiverId);
    } else {
      conversationPartners.add(msg.senderId);
    }
  });

  // For each partner, get the latest message
  const conversations = Array.from(conversationPartners).map(partnerId => {
    const convoMessages = userMessages.filter(
      msg => msg.senderId === partnerId || msg.receiverId === partnerId
    );

    // Sort by timestamp (descending) to get the latest message
    convoMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      partnerId,
      latestMessage: convoMessages[0],
      unreadCount: convoMessages.filter(
        msg => msg.senderId === partnerId && !msg.read && msg.receiverId === userId
      ).length
    };
  });

  // Sort conversations by latest message timestamp
  return conversations.sort(
    (a, b) => new Date(b.latestMessage.timestamp) - new Date(a.latestMessage.timestamp)
  );
}

// Function to add a new message
export function addMessage(messageData) {
  const newMessage = {
    id: `m${messages.length + 1}`,
    timestamp: new Date().toISOString(),
    read: false,
    ...messageData
  };

  messages.push(newMessage);
  return newMessage;
}

// Function to mark messages as read
export function markMessagesAsRead(userId, otherUserId) {
  if (!userId || !otherUserId) return;

  messages = messages.map(msg => {
    if (msg.senderId === otherUserId && msg.receiverId === userId && !msg.read) {
      return { ...msg, read: true };
    }
    return msg;
  });
}
