import ProtectedRoute from '../../components/auth/ProtectedRoute';
import PostFeed from '../../components/posts/PostFeed';
import CreatePost from '../../components/posts/CreatePost';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useState } from 'react';

export default function FeedPage() {
  const [refreshPosts, setRefreshPosts] = useState(false);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100">
        <AutoHideNavbar />

        <div className="pt-20 pb-8 max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            <CreatePost onPostCreated={() => setRefreshPosts(prev => !prev)} />
            <PostFeed key={refreshPosts.toString()} />
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-blue-200 px-4 py-3 shadow-2xl">
            <div className="flex justify-around items-center">
              <button className="p-3 text-blue-600 hover:text-cyan-600 transition-all duration-300 transform hover:scale-125">
                <span className="text-2xl">🏠</span>
              </button>
              <button className="p-3 text-blue-600 hover:text-cyan-600 transition-all duration-300 transform hover:scale-125">
                <span className="text-2xl">🔍</span>
              </button>
              <button className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-125 shadow-lg">
                <span className="text-2xl">➕</span>
              </button>
              <button className="p-3 text-blue-600 hover:text-cyan-600 transition-all duration-300 transform hover:scale-125">
                <span className="text-2xl">💬</span>
              </button>
              <button className="p-3 text-blue-600 hover:text-cyan-600 transition-all duration-300 transform hover:scale-125">
                <span className="text-2xl">🎓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}