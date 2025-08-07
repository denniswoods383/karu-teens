import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import ProfilePhoto from '../../components/user/ProfilePhoto';
import MessageStatus from '../../components/messages/MessageStatus';
import { useAuthStore } from '../../store/authStore';
import { useWebSocket } from '../../hooks/useWebSocket';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_delivered: boolean;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  username: string;
  full_name: string;
  last_message?: string;
  unread_count?: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { isConnected, onlineUsers, typingUsers, sendMessage: sendWsMessage, onMessage, sendTyping } = useWebSocket(user?.id);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadConversations();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Check if user parameter is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    if (userId) {
      setSelectedChat(parseInt(userId));
      // Add user to conversations if not already there
      addUserToConversations(parseInt(userId));
    }
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    // Scroll to bottom when messages change
    const container = document.getElementById('messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Handle incoming messages
    onMessage('new_message', (data) => {
      if (data.sender_id === selectedChat || data.receiver_id === selectedChat) {
        setMessages(prev => [...prev, {
          id: data.id,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          is_delivered: data.is_delivered || false,
          is_read: data.is_read,
          created_at: data.created_at
        }]);
      }
      
      // Refresh conversations to update unread counts
      loadConversations();
      
      // Show notification if not in current chat and not from current user
      if (data.sender_id !== selectedChat && data.sender_id !== user?.id) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`New message from ${data.sender_username}`, {
            body: data.content,
            icon: '/favicon.ico'
          });
        }
      }
    });
    
    // Handle read receipts
    onMessage('message_read', (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.message_id 
          ? { ...msg, is_read: true }
          : msg
      ));
    });
  }, [selectedChat, user?.id, onMessage]);

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

    const messageContent = newMessage;
    
    // Clear input immediately
    setNewMessage('');
    
    // Stop typing indicator
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    sendTyping(selectedChat, false);
    
    // Add message to UI immediately for better UX
    const tempMessage = {
      id: Date.now(),
      sender_id: user?.id || 0,
      receiver_id: selectedChat,
      content: messageContent,
      is_delivered: true,  // Show as delivered immediately
      is_read: false,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${getAPIBaseURL()}/api/v1/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: selectedChat,
          content: messageContent
        })
      });
      
      if (!response.ok) {
        // Remove the message if it failed to send and restore input
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        setNewMessage(messageContent);
      }
    } catch (error) {
      console.error('Network error:', error);
      // Remove the message if it failed to send and restore input
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(messageContent);
    }
  };

  const addUserToConversations = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        const userExists = conversations.find(c => c.id === userId);
        
        if (!userExists) {
          setConversations(prev => [...prev, {
            id: userData.id,
            username: userData.username,
            full_name: userData.full_name
          }]);
        }
      }
    } catch (error) {
      console.error('Failed to load user data');
    }
  };

  const loadAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/users/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const users = await response.json();
        // Filter out current user
        const otherUsers = users.filter((u: any) => u.id !== user?.id);
        
        // Sort by recent conversations first, then alphabetically
        const conversationUserIds = conversations.map(c => c.id);
        const sortedUsers = otherUsers.sort((a: any, b: any) => {
          const aInConversations = conversationUserIds.includes(a.id);
          const bInConversations = conversationUserIds.includes(b.id);
          
          if (aInConversations && !bInConversations) return -1;
          if (!aInConversations && bInConversations) return 1;
          
          // Both in conversations or both not - sort alphabetically
          return (a.full_name || a.username).localeCompare(b.full_name || b.username);
        });
        
        setAllUsers(sortedUsers);
        setSearchUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Failed to load users');
    }
  };

  const startNewChat = (userId: number) => {
    setSelectedChat(userId);
    setShowNewChat(false);
    addUserToConversations(userId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user: any) => 
        (user.full_name || user.username).toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchUsers(filtered);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100" style={{backgroundImage: 'url(/ui/messagesbackground.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <AutoHideNavbar />
        
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-8rem)] flex">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                  <button 
                    onClick={() => {
                      setShowNewChat(!showNewChat);
                      if (!showNewChat) loadAllUsers();
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    + New
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {showNewChat ? (
                  <div>
                    <div className="p-3 bg-gray-50 border-b">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {searchUsers.length > 0 ? (
                      searchUsers.map((user: any) => (
                        <button
                          key={user.id}
                          onClick={() => startNewChat(user.id)}
                          className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <ProfilePhoto 
                                userId={user.id}
                                username={user.username}
                                size="md"
                                showBadges={false}
                              />
                              {onlineUsers.includes(user.id) && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {user.full_name || user.username}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                @{user.username}
                                {conversations.find(c => c.id === user.id) && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Recent</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <p>No users found</p>
                        <p className="text-sm mt-2">Try a different search term</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {conversations.length > 0 ? (
                      conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedChat(conv.id)}
                          className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                            selectedChat === conv.id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <ProfilePhoto 
                              userId={conv.id}
                              username={conv.username}
                              size="md"
                              showBadges={false}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {conv.full_name || conv.username}
                              </p>
                              <p className="text-sm text-gray-500 truncate">@{conv.username}</p>
                              {conv.last_message && (
                                <p className="text-xs text-gray-400 truncate mt-1">
                                  {conv.last_message}
                                </p>
                              )}
                            </div>
                            {conv.unread_count && conv.unread_count > 0 && (
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {conv.unread_count > 9 ? '9+' : conv.unread_count}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <p>No conversations yet</p>
                        <p className="text-sm mt-2">Start a conversation by messaging someone!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <ProfilePhoto 
                          userId={selectedChat}
                          username={conversations.find(c => c.id === selectedChat)?.username || ''}
                          size="sm"
                          showBadges={false}
                        />
                        {onlineUsers.includes(selectedChat || 0) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {conversations.find(c => c.id === selectedChat)?.full_name || 
                           conversations.find(c => c.id === selectedChat)?.username}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {typingUsers[selectedChat || 0] ? (
                            <span className="text-green-600">typing...</span>
                          ) : onlineUsers.includes(selectedChat || 0) ? (
                            <span className="text-green-600">online</span>
                          ) : (
                            `@${conversations.find(c => c.id === selectedChat)?.username}`
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" id="messages-container">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-sm px-4 py-2 rounded-2xl ${
                              message.sender_id === user?.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className={`flex items-center justify-between mt-1 ${
                              message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <p className="text-xs">
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <MessageStatus 
                                isDelivered={message.is_delivered || false}
                                isRead={message.is_read}
                                isSentByMe={message.sender_id === user?.id}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          
                          // Handle typing indicator
                          if (selectedChat) {
                            sendTyping(selectedChat, true);
                            
                            if (typingTimeout.current) {
                              clearTimeout(typingTimeout.current);
                            }
                            
                            typingTimeout.current = setTimeout(() => {
                              sendTyping(selectedChat, false);
                            }, 1000);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            sendMessage(e);
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p>Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}