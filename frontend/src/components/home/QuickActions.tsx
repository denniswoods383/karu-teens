import { useAuthStore } from '../../store/authStore';

export default function QuickActions() {
  const { user } = useAuthStore();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
      <div className="space-y-2">
        <button 
          onClick={() => window.location.href = '/messages'}
          className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <span className="text-xl">💬</span>
          <span>Messages</span>
        </button>
        <button 
          onClick={() => window.location.href = `/profile/${user?.id}`}
          className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <span className="text-xl">👤</span>
          <span>My Profile</span>
        </button>
        <button 
          onClick={() => window.location.href = '/comrades'}
          className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <span className="text-xl">👥</span>
          <span>Find Comrades</span>
        </button>
        <button 
          onClick={() => window.location.href = '/analytics'}
          className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <span className="text-xl">📊</span>
          <span>Analytics</span>
        </button>
      </div>
    </div>
  );
}