import { useState, useEffect } from 'react';

interface Reply {
  id: number;
  content: string;
  author_id: number;
  created_at: string;
}

interface CommentRepliesProps {
  commentId: number;
  showReplies: boolean;
}

export default function CommentReplies({ commentId, showReplies }: CommentRepliesProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    if (showReplies) {
      loadReplies();
    }
  }, [showReplies, commentId]);

  const loadReplies = async () => {
    try {
      const response = await fetch(`http://10.0.0.122:8001/api/v1/moderation/comments/${commentId}/replies`);
      const data = await response.json();
      setReplies(data);
    } catch (error) {
      console.error('Failed to load replies');
    }
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://10.0.0.122:8001/api/v1/moderation/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newReply })
      });

      setNewReply('');
      setShowReplyForm(false);
      loadReplies();
    } catch (error) {
      console.error('Failed to submit reply');
    }
  };

  if (!showReplies) return null;

  return (
    <div className="ml-8 mt-2 space-y-2">
      {replies.map((reply) => (
        <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              U
            </div>
            <div className="flex-1">
              <p className="text-sm">{reply.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(reply.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}

      {showReplyForm ? (
        <form onSubmit={submitReply} className="mt-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
            >
              Reply
            </button>
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1 text-gray-500 text-sm hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowReplyForm(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reply
        </button>
      )}
    </div>
  );
}