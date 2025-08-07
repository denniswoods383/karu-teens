import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useAuthStore } from '../../store/authStore';

interface User {
  id: number;
  username: string;
  full_name: string;
  is_following: boolean;
  followers_count?: number;
  posts_count?: number;
}

export default function ComradesPage() {
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('suggestions');
  const { user } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Load followers
      const followersRes = await fetch(`http://10.0.0.122:8001/api/v1/social/followers/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Followers response status:', followersRes.status);
      
      if (followersRes.ok) {
        const followersData = await followersRes.json();
        console.log('Followers data:', followersData);
        console.log('Followers count:', followersData.length);
        setFollowers(Array.isArray(followersData) ? followersData : []);
      } else {
        const errorText = await followersRes.text();
        console.error('Followers API failed:', followersRes.status, errorText);
        setFollowers([]);
      }

      // Load following
      const followingRes = await fetch(`http://10.0.0.122:8001/api/v1/social/following/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (followingRes.ok) {
        const followingData = await followingRes.json();
        console.log('Following data:', followingData);
        setFollowing(followingData);
      } else {
        console.error('Following API failed:', followingRes.status);
        setFollowing([]);
      }

      // Load suggestions
      const suggestionsRes = await fetch(`${getAPIBaseURL()}/api/v1/auth/login`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (suggestionsRes.ok) {
        const suggestionsData = await suggestionsRes.json();
        console.log('Suggestions data:', suggestionsData);
        setSuggestions(suggestionsData);
      } else {
        console.error('Suggestions API failed:', suggestionsRes.status);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Failed to load data');
    }
  };

  const handleFollow = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/social/follow/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Remove user from suggestions immediately
        setSuggestions(prev => prev.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/social/follow/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Update user state immediately
        setSuggestions(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: false } : user
        ));
      }
    } catch (error) {
      console.error('Failed to unfollow user');
    }
  };

  const renderUserList = (users: User[], showFollowButton = true) => (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.full_name || user.username}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
              <div className="flex space-x-3 mt-1 text-xs text-gray-400">
                <span>{user.posts_count || 0} posts</span>
                <span>{user.followers_count || 0} followers</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.href = `/messages?user=${user.id}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700"
            >
              💬 Message
            </button>
            {showFollowButton && (
              <button
                onClick={() => user.is_following ? handleUnfollow(user.id) : handleFollow(user.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  user.is_following
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {user.is_following ? 'Unfollow' : 'nimekumark'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">Comrades</h1>
              <p className="text-gray-600 mt-1">Connect with your comrades</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button className="flex-1 py-4 px-6 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                Suggestions ({suggestions.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">People you may know</h3>
                {suggestions.length > 0 ? (
                  renderUserList(suggestions)
                ) : (
                  <p className="text-gray-500 text-center py-8">No suggestions available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}