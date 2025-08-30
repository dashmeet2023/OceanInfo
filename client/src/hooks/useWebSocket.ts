import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
  [key: string]: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: string | null;
  sendMessage: (message: WebSocketMessage) => void;
  disconnect: () => void;
  reconnect: () => void;
}

export function useWebSocket(url?: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelayRef = useRef(1000); // Start with 1 second

  const getWebSocketUrl = useCallback(() => {
    if (url) return url;
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws`;
  }, [url]);

  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl();
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        reconnectDelayRef.current = 1000; // Reset delay
        
        // Send authentication message if needed
        ws.send(JSON.stringify({
          type: 'authenticate',
          // userId would come from auth context in real implementation
        }));
        
        // Subscribe to relevant channels
        ws.send(JSON.stringify({
          type: 'subscribe',
          channel: 'dashboard',
        }));
        
        ws.send(JSON.stringify({
          type: 'subscribe',
          channel: 'activity',
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(event.data);
          
          // Handle specific message types
          switch (message.type) {
            case 'connected':
              console.log('WebSocket connection confirmed');
              break;
            case 'authenticated':
              console.log('WebSocket authenticated');
              break;
            case 'heartbeat':
              // Respond to heartbeat
              ws.send(JSON.stringify({
                type: 'heartbeat',
                timestamp: Date.now(),
              }));
              break;
            default:
              // Handle other message types in components
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        
        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = reconnectDelayRef.current * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`Attempting to reconnect in ${delay}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            reconnectDelayRef.current = Math.min(delay * 2, 30000); // Max 30 seconds
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [getWebSocketUrl]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, 'Manual disconnect');
    }
    
    wsRef.current = null;
    setIsConnected(false);
    reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent auto-reconnect
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    reconnectDelayRef.current = 1000;
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected) {
        // Reconnect when page becomes visible
        reconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, reconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect,
  };
}
