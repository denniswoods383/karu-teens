import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

const AdminMessaging = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'denniswood383@gmail.com') {
        router.push('/');
        return;
      }
      fetchUsers();
    };
    checkAdmin();
  }, [router]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username');
    
    if (!error) setUsers(data || []);
  };

  const sendMessage = async () => {
    if (!selectedUser || !message.trim()) return;
    
    setSending(true);
    try {
      // Send as notification
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedUser.id,
          type: 'admin_message',
          title: 'Message from Admin',
          message: message.trim(),
          created_at: new Date().toISOString()
        });
      
      // Send as direct message from "admin"
      const { data: adminMessage, error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: null, // null indicates system/admin message
          receiver_id: selectedUser.id,
          content: message.trim()
        })
        .select();
      

      
      alert(`Message sent to ${selectedUser.username}`);
      setMessage('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Messaging</h1>
            <button
              onClick={() => router.push('/mhesh')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Admin
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Users List */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Select User</h2>
              <div className="max-h-96 overflow-y-auto border rounded">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-left p-3 border-b hover:bg-gray-50 ${
                      selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="font-medium">{user.full_name || user.username}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Form */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Send Message</h2>
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium">Sending to:</div>
                    <div>{selectedUser.full_name || selectedUser.username}</div>
                    <div className="text-sm text-gray-500">@{selectedUser.username}</div>
                  </div>
                  
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your admin message here..."
                    className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={sending || !message.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send Admin Message'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Select a user to send a message
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessaging;