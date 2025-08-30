import { WebSocketServer, WebSocket } from 'ws';
import { IStorage } from '../storage';

interface Client {
  ws: WebSocket;
  userId?: string;
  isAuthenticated: boolean;
  subscriptions: Set<string>;
}

export function setupWebSocket(wss: WebSocketServer, storage: IStorage) {
  const clients = new Map<WebSocket, Client>();

  wss.on('connection', (ws: WebSocket) => {
    const client: Client = {
      ws,
      isAuthenticated: false,
      subscriptions: new Set(),
    };
    
    clients.set(ws, client);
    console.log('WebSocket client connected');

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'authenticate':
            // TODO: Implement proper WebSocket authentication
            client.isAuthenticated = true;
            client.userId = message.userId;
            ws.send(JSON.stringify({
              type: 'authenticated',
              success: true,
            }));
            break;
            
          case 'subscribe':
            if (client.isAuthenticated) {
              const { channel } = message;
              client.subscriptions.add(channel);
              ws.send(JSON.stringify({
                type: 'subscribed',
                channel,
              }));
            }
            break;
            
          case 'unsubscribe':
            if (client.isAuthenticated) {
              const { channel } = message;
              client.subscriptions.delete(channel);
              ws.send(JSON.stringify({
                type: 'unsubscribed',
                channel,
              }));
            }
            break;
            
          case 'heartbeat':
            ws.send(JSON.stringify({
              type: 'heartbeat',
              timestamp: Date.now(),
            }));
            break;
            
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
        }));
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: Date.now(),
    }));
  });

  // Broadcast to all authenticated clients
  function broadcast(message: any, channel?: string) {
    const data = JSON.stringify(message);
    
    clients.forEach((client) => {
      if (client.isAuthenticated && client.ws.readyState === WebSocket.OPEN) {
        if (!channel || client.subscriptions.has(channel)) {
          client.ws.send(data);
        }
      }
    });
  }

  // Broadcast to specific user
  function broadcastToUser(userId: string, message: any) {
    const data = JSON.stringify(message);
    
    clients.forEach((client) => {
      if (client.isAuthenticated && 
          client.userId === userId && 
          client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    });
  }

  // Send real-time updates every 10 seconds
  setInterval(async () => {
    try {
      const [stats, recentActivity] = await Promise.all([
        storage.getSystemStats(),
        storage.getRecentActivity(5),
      ]);

      broadcast({
        type: 'stats_update',
        data: stats,
      }, 'dashboard');

      broadcast({
        type: 'activity_update',
        data: recentActivity,
      }, 'activity');

    } catch (error) {
      console.error('Error sending real-time updates:', error);
    }
  }, 10000);

  // Send heartbeat every 30 seconds to keep connections alive
  setInterval(() => {
    broadcast({
      type: 'heartbeat',
      timestamp: Date.now(),
    });
  }, 30000);

  return {
    broadcast,
    broadcastToUser,
    getConnectedClients: () => clients.size,
  };
}
