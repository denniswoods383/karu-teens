import { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useAuthStore } from '../../store/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={user?.full_name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Password</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Change Password
        </button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="radio" name="visibility" className="mr-3" defaultChecked />
            <span>Public - Anyone can see your profile</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="visibility" className="mr-3" />
            <span>Friends only - Only your comrades can see your profile</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="visibility" className="mr-3" />
            <span>Private - Only you can see your profile</span>
          </label>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Data & Privacy</h3>
        <div className="space-y-3">
          <button className="block w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            📥 Download my data
          </button>
          <button className="block w-full text-left p-3 border border-red-300 rounded-lg hover:bg-red-50 text-red-600">
            🗑️ Delete my account
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span>Likes on your posts</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </label>
          <label className="flex items-center justify-between">
            <span>Comments on your posts</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </label>
          <label className="flex items-center justify-between">
            <span>New followers</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </label>
          <label className="flex items-center justify-between">
            <span>Direct messages</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </label>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span>Weekly digest</span>
            <input type="checkbox" className="toggle" />
          </label>
          <label className="flex items-center justify-between">
            <span>Security alerts</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          <button className="p-4 border-2 border-blue-500 rounded-lg bg-white">
            <div className="w-full h-8 bg-white border rounded mb-2"></div>
            <span className="text-sm">Light</span>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg bg-gray-900">
            <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
            <span className="text-sm text-white">Dark</span>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-full h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-2"></div>
            <span className="text-sm text-white">Auto</span>
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Font Size</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="radio" name="fontSize" className="mr-3" />
            <span className="text-sm">Small</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="fontSize" className="mr-3" defaultChecked />
            <span>Medium</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="fontSize" className="mr-3" />
            <span className="text-lg">Large</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account preferences</p>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 border-r border-gray-200">
                <nav className="p-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                {activeTab === 'account' && renderAccountSettings()}
                {activeTab === 'privacy' && renderPrivacySettings()}
                {activeTab === 'notifications' && renderNotificationSettings()}
                {activeTab === 'appearance' && renderAppearanceSettings()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}