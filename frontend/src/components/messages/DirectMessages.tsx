import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  username: string;
  full_name: string;
}

export default function DirectMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
    }
  }, [selectedChat]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/messages/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations');
    }
  };

  const loadMessages = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/messages/chat/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${getAPIBaseURL()}/api/v1/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: selectedChat,
          content: newMessage
        })
      });
      
      setNewMessage('');
      loadMessages(selectedChat);
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Messages</h3>
        </div>
        <div className="overflow-y-auto h-80">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 ${
                selectedChat === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {conv.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{conv.full_name || conv.username}</p>
                  <p className="text-xs text-gray-500">@{conv.username}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b">
              <h4 className="font-semibold">
                {conversations.find(c => c.id === selectedChat)?.username}
              </h4>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}