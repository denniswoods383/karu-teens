import { useState, useEffect } from 'react';
import { User } from '../../types/auth';

interface UserProfileProps {
  userId: number;
  currentUserId: number;
}

export default function UserProfile({ userId, currentUserId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const response = await fetch(`http://10.0.0.122:8001/api/v1/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = isFollowing ? 'DELETE' : 'POST';
      
      await fetch(`http://10.0.0.122:8001/api/v1/users/${userId}/follow`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to follow/unfollow');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Cover Photo */}
      <div className="h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg relative">
        <div className="absolute -bottom-6 left-6">
          <div className="w-40 h-40 bg-white rounded-full p-1">
            <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="pt-8 pb-4 px-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.full_name || user.username}</h1>
            <p className="text-gray-600 text-lg">@{user.username}</p>
            {user.bio && <p className="text-gray-800 mt-2">{user.bio}</p>}
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>📍 Location</span>
              <span>🎂 Joined {new Date(user.created_at).getFullYear()}</span>
            </div>
          </div>
          
          {userId !== currentUserId && (
            <div className="flex space-x-2">
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isFollowing 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300">
                Message
              </button>
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}