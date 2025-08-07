import ProtectedRoute from '../../components/auth/ProtectedRoute';
import PostFeed from '../../components/posts/PostFeed';
import DirectMessages from '../../components/messages/DirectMessages';
import NotificationsList from '../../components/notifications/NotificationsList';
import LiveNotifications from '../../components/notifications/LiveNotifications';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import ResponsiveLayout from '../../components/layout/ResponsiveLayout';
import StoriesBar from '../../components/stories/StoriesBar';
import AdvancedSearch from '../../components/search/AdvancedSearch';
import QuickActions from '../../components/home/QuickActions';

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout backgroundImage="/ui/feedbackground.jpeg" className="bg-gradient-1">
        <AutoHideNavbar />

        <div className="pt-16 sm:pt-20 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <QuickActions />
              </div>
            </div>

            {/* Main Feed */}
            <div className="col-span-1 lg:col-span-2">
              <StoriesBar />
              <PostFeed />
            </div>

            {/* Right Sidebar - Hidden on mobile */}
            <div className="hidden lg:block space-y-6">
              <div className="sticky top-20 space-y-6">
                <AdvancedSearch />
                <NotificationsList />
                <DirectMessages />
              </div>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around items-center">
              <button className="p-2 text-gray-600 hover:text-blue-600">
                🏠
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                🔍
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                ➕
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                💬
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                👤
              </button>
            </div>
          </div>
        </div>
        
        <LiveNotifications />
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}