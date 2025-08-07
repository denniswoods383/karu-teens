import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface Notification {
  type: string;
  message: string;
  user?: string;
  post_id?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const websocket = new WebSocket(`ws://10.0.0.122:8001/api/v1/notifications/${token}`);
    
    websocket.onopen = () => {
      console.log('Notification WebSocket connected');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.message, {
          icon: '/favicon.ico',
          tag: 'social-notification'
        });
      }
    };

    websocket.onclose = () => {
      console.log('Notification WebSocket disconnected');
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      websocket.close();
    };
  }, [user]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return { notifications, isConnected: ws !== null };
};