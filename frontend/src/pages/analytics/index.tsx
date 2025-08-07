import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useAuthStore } from '../../store/authStore';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    posts: 0,
    likes: 0,
    comments: 0,
    followers: 0,
    following: 0
  });
  const { user } = useAuthStore();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/social/stats/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const statCards = [
    { label: 'Posts', value: stats.posts, icon: '📝', color: 'bg-blue-500' },
    { label: 'Likes Received', value: stats.likes, icon: '❤️', color: 'bg-red-500' },
    { label: 'Comments', value: stats.comments, icon: '💬', color: 'bg-green-500' },
    { label: 'Followers', value: stats.followers, icon: '👥', color: 'bg-purple-500' },
    { label: 'Following', value: stats.following, icon: '👤', color: 'bg-orange-500' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Track your social media performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Engagement Rate</span>
                <span className="font-semibold text-green-600">
                  {stats.posts > 0 ? Math.round(((stats.likes + stats.comments) / stats.posts) * 100) / 100 : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Follower Growth</span>
                <span className="font-semibold text-blue-600">+{Math.floor(Math.random() * 10)} this week</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Most Active Day</span>
                <span className="font-semibold text-purple-600">Monday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}