import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

interface Story {
  id: number;
  user_id: number;
  content: string;
  image_url: string;
  created_at: string;
  expires_at: string;
}

interface UserStories {
  [userId: string]: Story[];
}

export default function StoriesBar() {
  const [userStories, setUserStories] = useState<UserStories>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStoryContent, setNewStoryContent] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/v1/auth/login`);
      const data = await response.json();
      setUserStories(data);
    } catch (error) {
      console.error('Failed to load stories');
    }
  };

  const createStory = async () => {
    if (!newStoryContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${getAPIBaseURL()}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newStoryContent })
      });
      
      setNewStoryContent('');
      setShowCreateModal(false);
      loadStories();
    } catch (error) {
      console.error('Failed to create story');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex space-x-4 overflow-x-auto">
          {/* Create Story */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-shrink-0 flex flex-col items-center space-y-2"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400">
              <span className="text-2xl">+</span>
            </div>
            <span className="text-xs text-gray-600">Your Story</span>
          </button>

          {/* User Stories */}
          {Object.entries(userStories).map(([userId, stories]) => (
            <button
              key={userId}
              className="flex-shrink-0 flex flex-col items-center space-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-0.5">
                <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {stories[0]?.user_id === user?.id ? user.username[0].toUpperCase() : 'U'}
                </div>
              </div>
              <span className="text-xs text-gray-600 max-w-16 truncate">
                {stories[0]?.user_id === user?.id ? 'You' : `User ${userId}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Story</h3>
            
            <textarea
              value={newStoryContent}
              onChange={(e) => setNewStoryContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createStory}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}