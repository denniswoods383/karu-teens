import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';

interface Message {
  id: string;
  content: string;
  from_user: number;
  timestamp: Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { token, user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      const websocket = new WebSocket(`ws://10.0.0.122:8001/api/v1/ws/${token}`);
      
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: data.message,
            from_user: data.from_user,
            timestamp: new Date()
          }]);
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setWs(null);
      };

      return () => {
        websocket.close();
      };
    }
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws) return;

    ws.send(JSON.stringify({
      type: 'chat',
      message: newMessage,
      to_user: 1 // For demo, sending to user 1
    }));

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: newMessage,
      from_user: user?.id || 0,
      timestamp: new Date()
    }]);

    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-96 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from_user === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.from_user === user?.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}