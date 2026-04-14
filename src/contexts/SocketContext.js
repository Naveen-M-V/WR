import React, { createContext, useContext, useCallback } from 'react';
import useSocket from '../hooks/useSocket';

// Create Socket.IO context
const SocketContext = createContext(null);

/**
 * Socket.IO Provider Component
 * Provides real-time socket functionality to entire app
 */
export const SocketProvider = ({ children, token }) => {
  // Update handlers for different content types
  const handleContentUpdate = useCallback((data) => {
    // Dispatch custom event that components can listen to
    const event = new CustomEvent('socket:content-updated', { detail: data });
    window.dispatchEvent(event);
  }, []);

  const handleCompanyUpdate = useCallback((data) => {
    const event = new CustomEvent('socket:company-updated', { detail: data });
    window.dispatchEvent(event);
  }, []);

  const handleNewsUpdate = useCallback((data) => {
    const event = new CustomEvent('socket:news-updated', { detail: data });
    window.dispatchEvent(event);
  }, []);

  const handleAdvertisementUpdate = useCallback((data) => {
    const event = new CustomEvent('socket:advertisement-updated', { detail: data });
    window.dispatchEvent(event);
  }, []);

  const handleEventUpdate = useCallback((data) => {
    const event = new CustomEvent('socket:event-updated', { detail: data });
    window.dispatchEvent(event);
  }, []);

  const handleBroadcastMessage = useCallback((data) => {
    const event = new CustomEvent('socket:broadcast-message', { detail: data });
    window.dispatchEvent(event);
  }, []);

  // Setup Socket.IO with handlers
  const socket = useSocket({
    token,
    onContentUpdate: handleContentUpdate,
    onCompanyUpdate: handleCompanyUpdate,
    onNewsUpdate: handleNewsUpdate,
    onAdvertisementUpdate: handleAdvertisementUpdate,
    onEventUpdate: handleEventUpdate,
    onBroadcastMessage: handleBroadcastMessage,
    debug: process.env.NODE_ENV === 'development', // Enable debugging in development
  });

  const value = {
    ...socket,
    // Additional utilities
    subscribeToContentUpdates: (callback) => {
      const handler = (event) => callback(event.detail);
      window.addEventListener('socket:content-updated', handler);
      return () => window.removeEventListener('socket:content-updated', handler);
    },
    subscribeToCompanyUpdates: (callback) => {
      const handler = (event) => callback(event.detail);
      window.addEventListener('socket:company-updated', handler);
      return () => window.removeEventListener('socket:company-updated', handler);
    },
    subscribeToNewsUpdates: (callback) => {
      const handler = (event) => callback(event.detail);
      window.addEventListener('socket:news-updated', handler);
      return () => window.removeEventListener('socket:news-updated', handler);
    },
    subscribeToAdvertisementUpdates: (callback) => {
      const handler = (event) => callback(event.detail);
      window.addEventListener('socket:advertisement-updated', handler);
      return () => window.removeEventListener('socket:advertisement-updated', handler);
    },
    subscribeToEventUpdates: (callback) => {
      const handler = (event) => callback(event.detail);
      window.addEventListener('socket:event-updated', handler);
      return () => window.removeEventListener('socket:event-updated', handler);
    },
    subscribeToBroadcastMessages: (callback) => {
      const handler = (event) => callback(event.detail);
      window.addEventListener('socket:broadcast-message', handler);
      return () => window.removeEventListener('socket:broadcast-message', handler);
    },
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Hook to use Socket.IO context
 * Usage: const socket = useSocketContext();
 */
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    console.warn('useSocketContext must be used within SocketProvider');
    return null;
  }
  return context;
};

export default SocketContext;
