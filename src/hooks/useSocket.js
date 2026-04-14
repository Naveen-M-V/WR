import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

/**
 * Custom hook for Socket.IO real-time updates
 * Usage:
 * const socket = useSocket({
 *   token: authToken,
 *   onContentUpdate: (data) => console.log('Content updated:', data),
 *   onCompanyUpdate: (data) => console.log('Company updated:', data),
 * });
 */
export const useSocket = (options = {}) => {
  const {
    token,
    onContentUpdate,
    onCompanyUpdate,
    onNewsUpdate,
    onAdvertisementUpdate,
    onEventUpdate,
    onBroadcastMessage,
    debug = false,
  } = options;

  const socketRef = useRef(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    // Don't create multiple connections
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    try {
      // Connect to Socket.IO server
      const auth = token ? { token } : {};
      
      socketRef.current = io(SOCKET_SERVER_URL, {
        auth,
        reconnection: true, 
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        transports: ['websocket', 'polling'],
      });

      // Connection event
      socketRef.current.on('connect', () => {
        if (debug) {
          console.log('[Socket.IO] Connected:', socketRef.current.id);
        }
      });

      // Handle content updates
      if (onContentUpdate) {
        socketRef.current.on('content-updated', (data) => {
          if (debug) {
            console.log('[Socket.IO] Content updated:', data);
          }
          onContentUpdate(data);
        });
      }

      // Handle company updates
      if (onCompanyUpdate) {
        socketRef.current.on('company-updated', (data) => {
          if (debug) {
            console.log('[Socket.IO] Company updated:', data);
          }
          onCompanyUpdate(data);
        });
      }

      // Handle news updates
      if (onNewsUpdate) {
        socketRef.current.on('news-updated', (data) => {
          if (debug) {
            console.log('[Socket.IO] News updated:', data);
          }
          onNewsUpdate(data);
        });
      }

      // Handle advertisement updates
      if (onAdvertisementUpdate) {
        socketRef.current.on('advertisement-updated', (data) => {
          if (debug) {
            console.log('[Socket.IO] Advertisement updated:', data);
          }
          onAdvertisementUpdate(data);
        });
      }

      // Handle event updates
      if (onEventUpdate) {
        socketRef.current.on('event-updated', (data) => {
          if (debug) {
            console.log('[Socket.IO] Event updated:', data);
          }
          onEventUpdate(data);
        });
      }

      // Handle broadcast messages
      if (onBroadcastMessage) {
        socketRef.current.on('broadcast-message', (data) => {
          if (debug) {
            console.log('[Socket.IO] Broadcast message:', data);
          }
          onBroadcastMessage(data);
        });
      }

      // Handle user connection
      socketRef.current.on('user-connected', (data) => {
        if (debug) {
          console.log('[Socket.IO] User connected:', data);
        }
      });

      // Handle user disconnection
      socketRef.current.on('user-disconnected', (data) => {
        if (debug) {
          console.log('[Socket.IO] User disconnected:', data);
        }
      });

      // Handle errors
      socketRef.current.on('error', (error) => {
        console.error('[Socket.IO] Error:', error);
      });

      // Handle disconnect
      socketRef.current.on('disconnect', () => {
        if (debug) {
          console.log('[Socket.IO] Disconnected');
        }
      });
    } catch (error) {
      console.error('[Socket.IO] Failed to setup socket:', error);
      isConnectingRef.current = false;
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [token, onContentUpdate, onCompanyUpdate, onNewsUpdate, onAdvertisementUpdate, onEventUpdate, onBroadcastMessage, debug]);

  // Method to manually emit events
  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
      if (debug) {
        console.log('[Socket.IO] Emitted:', event, data);
      }
    } else {
      console.warn('[Socket.IO] Socket not connected');
    }
  }, [debug]);

  // Method to request sync
  const requestSync = useCallback(() => {
    emit('request-sync', {});
  }, [emit]);

  return {
    socket: socketRef.current,
    emit,
    requestSync,
    isConnected: socketRef.current?.connected || false,
  };
};

export default useSocket;
