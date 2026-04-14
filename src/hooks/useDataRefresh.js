import { useEffect, useCallback } from 'react';
import { useSocketContext } from '../contexts/SocketContext';

/**
 * Hook to automatically refresh data when socket updates are received
 * Usage:
 * useDataRefresh({
 *   onContentUpdate: (data) => console.log('Content updated:', data),
 *   onCompanyUpdate: (data) => console.log('Company updated:', data),
 * });
 */
export const useDataRefresh = (handlers = {}) => {
  const socket = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    const subscriptions = [];

    // Subscribe to content updates
    if (handlers.onContentUpdate) {
      const unsub = socket.subscribeToContentUpdates((data) => {
        console.log('[useDataRefresh] Content updated:', data.section);
        handlers.onContentUpdate(data);
      });
      subscriptions.push(unsub);
    }

    // Subscribe to company updates
    if (handlers.onCompanyUpdate) {
      const unsub = socket.subscribeToCompanyUpdates((data) => {
        console.log('[useDataRefresh] Company updated:', data.action);
        handlers.onCompanyUpdate(data);
      });
      subscriptions.push(unsub);
    }

    // Subscribe to news updates
    if (handlers.onNewsUpdate) {
      const unsub = socket.subscribeToNewsUpdates((data) => {
        console.log('[useDataRefresh] News updated:', data.action);
        handlers.onNewsUpdate(data);
      });
      subscriptions.push(unsub);
    }

    // Subscribe to advertisement updates
    if (handlers.onAdvertisementUpdate) {
      const unsub = socket.subscribeToAdvertisementUpdates((data) => {
        console.log('[useDataRefresh] Advertisement updated:', data.action);
        handlers.onAdvertisementUpdate(data);
      });
      subscriptions.push(unsub);
    }

    // Subscribe to event updates
    if (handlers.onEventUpdate) {
      const unsub = socket.subscribeToEventUpdates((data) => {
        console.log('[useDataRefresh] Event updated:', data.action);
        handlers.onEventUpdate(data);
      });
      subscriptions.push(unsub);
    }

    // Subscribe to broadcast messages
    if (handlers.onBroadcastMessage) {
      const unsub = socket.subscribeToBroadcastMessages((data) => {
        console.log('[useDataRefresh] Broadcast message:', data.title);
        handlers.onBroadcastMessage(data);
      });
      subscriptions.push(unsub);
    }

    // Cleanup subscriptions on unmount
    return () => {
      subscriptions.forEach(unsub => unsub());
    };
  }, [socket, handlers]);

  // Return socket for manual operations
  return socket;
};

/**
 * Hook to make an API request and refetch on socket updates
 * Usage:
 * const data = useLiveData('/api/content/news', 'news');
 */
export const useLiveData = (apiUrl, dataType = 'content') => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('[useLiveData] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup socket subscriptions for auto-refresh
  useDataRefresh({
    onContentUpdate: (data) => {
      if (dataType === 'content') fetchData();
    },
    onCompanyUpdate: (data) => {
      if (dataType === 'company') fetchData();
    },
    onNewsUpdate: (data) => {
      if (dataType === 'news') fetchData();
    },
    onAdvertisementUpdate: (data) => {
      if (dataType === 'advertisement') fetchData();
    },
    onEventUpdate: (data) => {
      if (dataType === 'event') fetchData();
    },
  });

  return { data, loading, error, refetch: fetchData };
};

export default useDataRefresh;
