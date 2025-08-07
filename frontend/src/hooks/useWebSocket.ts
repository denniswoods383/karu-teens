import { useEffect, useRef, useState } from 'react';
import { getWebSocketURL } from '../utils/ipDetection';

interface WebSocketMessage {
  type: string;
  data: any;
}

export const useWebSocket = (userId: number | undefined) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [typingUsers, setTypingUsers] = useState<{[key: number]: boolean}>({});
  const ws = useRef<WebSocket | null>(null);
  const messageHandlers = useRef<{[key: string]: (data: any) => void}>({});

  useEffect(() => {
    if (!userId) return;

    const connect = () => {
      ws.current = new WebSocket(`${getWebSocketURL()}/ws/${userId}`);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        if (message.type === 'user_online') {
          setOnlineUsers(prev => [...prev.filter(id => id !== message.data.user_id), message.data.user_id]);
        } else if (message.type === 'user_offline') {
          setOnlineUsers(prev => prev.filter(id => id !== message.data.user_id));
        } else if (message.type === 'typing_start') {
          setTypingUsers(prev => ({ ...prev, [message.data.user_id]: true }));
        } else if (message.type === 'typing_stop') {
          setTypingUsers(prev => ({ ...prev, [message.data.user_id]: false }));
        }
        
        // Call registered handlers
        if (messageHandlers.current[message.type]) {
          messageHandlers.current[message.type](message.data);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected, reconnecting...');
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  const sendMessage = (type: string, data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, data }));
    }
  };

  const onMessage = (type: string, handler: (data: any) => void) => {
    messageHandlers.current[type] = handler;
  };

  const sendTyping = (receiverId: number, isTyping: boolean) => {
    sendMessage(isTyping ? 'typing_start' : 'typing_stop', { receiver_id: receiverId });
  };

  return {
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    onMessage,
    sendTyping
  };
};