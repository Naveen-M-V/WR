// Socket.IO setup and event handlers

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import sessionManager from './utils/sessionManager.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export const setupSocketIO = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      // Allow unauthenticated connections for reading data
      return next();
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      console.error('[Socket.IO] Authentication error:', error.message);
      next(new Error('Authentication error'));
    }
  });

  // Connection event
  io.on('connection', (socket) => {
    const user = socket.user;
    sessionManager.registerSession(socket.id, user);

    console.log(`[Socket.IO] User connected: ${user?.email || 'anonymous'} (${socket.id})`);
    sessionManager.logSessionInfo();

    // Join user-specific room if authenticated
    if (user?.userId) {
      socket.join(`user:${user.userId}`);
      socket.join(`role:${user.role}`); // Join role-based room
      io.emit('user-connected', {
        userId: user.userId,
        email: user.email,
        connectedAt: new Date(),
      });
    }

    // Join all users to a broadcast room
    socket.join('broadcast');

    // Handle custom events
    socket.on('request-sync', (data) => {
      console.log('[Socket.IO] Sync request from:', user?.email || 'anonymous');
      socket.emit('sync-response', { timestamp: new Date(), message: 'Server sync acknowledged' });
    });

    socket.on('disconnect', () => {
      sessionManager.removeSession(socket.id);
      console.log(`[Socket.IO] User disconnected: ${user?.email || 'anonymous'}`);
      sessionManager.logSessionInfo();

      if (user?.userId) {
        io.emit('user-disconnected', {
          userId: user.userId,
          disconnectedAt: new Date(),
        });
      }
    });

    socket.on('error', (error) => {
      console.error('[Socket.IO] Socket error:', error);
    });
  });

  // Utility functions to emit events
  const emitContentUpdate = (section, data, updatedBy) => {
    io.emit('content-updated', {
      section,
      data,
      updatedBy,
      timestamp: new Date(),
    });
    console.log(`[Socket.IO] Content updated: ${section}`);
  };

  const emitCompanyUpdate = (action, company, updatedBy) => {
    io.emit('company-updated', {
      action, // 'created', 'updated', 'deleted'
      company,
      updatedBy,
      timestamp: new Date(),
    });
    console.log(`[Socket.IO] Company event: ${action}`);
  };

  const emitNewsUpdate = (action, news, updatedBy) => {
    io.emit('news-updated', {
      action,
      news,
      updatedBy,
      timestamp: new Date(),
    });
    console.log(`[Socket.IO] News event: ${action}`);
  };

  const emitAdvertisementUpdate = (action, advertisement, updatedBy) => {
    io.emit('advertisement-updated', {
      action,
      advertisement,
      updatedBy,
      timestamp: new Date(),
    });
    console.log(`[Socket.IO] Advertisement event: ${action}`);
  };

  const emitEventUpdate = (action, event, updatedBy) => {
    io.emit('event-updated', {
      action,
      event,
      updatedBy,
      timestamp: new Date(),
    });
    console.log(`[Socket.IO] Event event: ${action}`);
  };

  const broadcastUserUpdate = (message, title = 'Notification') => {
    io.to('broadcast').emit('broadcast-message', {
      title,
      message,
      timestamp: new Date(),
    });
  };

  return {
    io,
    emitContentUpdate,
    emitCompanyUpdate,
    emitNewsUpdate,
    emitAdvertisementUpdate,
    emitEventUpdate,
    broadcastUserUpdate,
  };
};
