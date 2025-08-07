import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface PostActionsProps {
  post: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

export default function PostActions({ post, onEdit, onDelete, onReport }: PostActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuthStore();
  const isOwner = user?.id === post.author_id;

  const handleEdit = () => {
    onEdit?.();
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://10.0.0.122:8001/api/v1/posts/${post.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        onDelete?.();
      } catch (error) {
        console.error('Failed to delete post');
      }
    }
    setShowMenu(false);
  };

  const handleReport = () => {
    onReport?.();
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <span className="text-gray-500">⋯</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          {isOwner ? (
            <>
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <span>✏️</span>
                <span>Edit Post</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600"
              >
                <span>🗑️</span>
                <span>Delete Post</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleReport}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <span>🚩</span>
                <span>Report Post</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                <span>🔇</span>
                <span>Hide Post</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}