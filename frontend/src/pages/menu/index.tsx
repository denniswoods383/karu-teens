import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useAuthStore } from '../../store/authStore';

export default function MenuPage() {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: '👤', label: 'Profile', action: () => window.location.href = `/profile/${user?.id}` },
    { icon: '💬', label: 'Messages', action: () => window.location.href = '/messages' },
    { icon: '👥', label: 'Comrades', action: () => window.location.href = '/comrades' },
    { icon: '🔔', label: 'Notifications', action: () => window.location.href = '/notifications' },
    { icon: '⚙️', label: 'Settings', action: () => window.location.href = '/settings' },
    { icon: '📊', label: 'Analytics', action: () => window.location.href = '/analytics' },
    { icon: '❓', label: 'Help & Support', action: () => window.location.href = '/help' },
    { icon: '🔒', label: 'Privacy Policy', action: () => window.location.href = '/privacy' },
    { icon: '🚪', label: 'Logout', action: logout, danger: true }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="max-w-2xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.username[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{user?.full_name || user?.username}</h1>
                  <p className="text-gray-600">@{user?.username}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center space-x-4 p-4 hover:bg-gray-50 text-left ${
                    item.danger ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-auto text-gray-400">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}