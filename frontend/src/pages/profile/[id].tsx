import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useAuthStore } from '../../store/authStore';
import { getRelativeTime } from '../../utils/timeUtils';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0, comments: 0, likes: 0 });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropScale, setCropScale] = useState(1);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPost, setDeletingPost] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      loadStats();
      loadPosts();
      loadBadges();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const userSpecificPosts = [];
      
      // Get each post individually to get full data
      const allPostsResponse = await fetch(`http://10.0.0.122:8001/api/v1/posts/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (allPostsResponse.ok) {
        const allPosts = await allPostsResponse.json();
        const myPosts = allPosts.filter((post: any) => post.author.id === user?.id);
        
        for (const post of myPosts) {
          try {
            const postResponse = await fetch(`http://10.0.0.122:8001/api/v1/posts/${post.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (postResponse.ok) {
              const fullPost = await postResponse.json();
              userSpecificPosts.push(fullPost);
            } else {
              userSpecificPosts.push({ ...post, likes_count: 0, comments_count: 0 });
            }
          } catch (error) {
            userSpecificPosts.push({ ...post, likes_count: 0, comments_count: 0 });
          }
        }
      }
      
      console.log('Posts with real counts:', userSpecificPosts);
      setUserPosts(userSpecificPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBadges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/users/${user?.id}/badges`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userBadges = await response.json();
        setBadges(userBadges);
      }
    } catch (error) {
      console.error('Failed to load badges:', error);
    }
  };

  const deletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setDeletingPost(postId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setUserPosts(prev => prev.filter((post: any) => post.id !== postId));
        await loadStats();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setDeletingPost(null);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const postsResponse = await fetch(`http://10.0.0.122:8001/api/v1/posts/?user_id=${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const posts = await postsResponse.json();
      
      // Calculate total comments and likes across all posts
      const totalComments = posts.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0);
      const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.likes_count || 0), 0);
      
      const profileResponse = await fetch(`http://10.0.0.122:8001/api/v1/users/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setStats({
          posts: posts.length || 0,
          followers: profile.followers_count || 0,
          following: profile.following_count || 0,
          comments: totalComments,
          likes: totalLikes
        });
        setProfilePhoto(profile.profile_photo || null);
      } else {
        setStats({
          posts: posts.length || 0,
          followers: 0,
          following: 0,
          comments: totalComments,
          likes: totalLikes
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100" style={{backgroundImage: 'url(/ui/profile_page_background.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <AutoHideNavbar />
        
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden relative">
                    {profilePhoto && profilePhoto !== 'null' && profilePhoto !== '' ? (
                      <img 
                        src={profilePhoto} 
                        alt={user.username} 
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center">
                        {user.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.full_name || user.username}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{stats.posts}</p>
                  <p className="text-gray-600">Posts</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{stats.likes}</p>
                  <p className="text-gray-600">Likes</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{stats.comments}</p>
                  <p className="text-gray-600">Comments</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{stats.followers}</p>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{stats.following}</p>
                  <p className="text-gray-600">Following</p>
                </div>
              </div>
            </div>
            
            {badges.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Badges</h2>
                <div className="flex flex-wrap gap-3">
                  {badges.map((badge: any) => (
                    <div key={badge.id} className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <p className="text-sm font-medium text-yellow-800">{badge.name}</p>
                      <p className="text-xs text-yellow-600">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Posts ({userPosts.length})</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading posts...</p>
                </div>
              ) : userPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userPosts.map((post: any) => (
                    <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative">
                      <button
                        onClick={() => deletePost(post.id)}
                        disabled={deletingPost === post.id}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        title="Delete post"
                      >
                        {deletingPost === post.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <span className="text-lg">×</span>
                        )}
                      </button>
                      <p className="text-gray-900 text-sm mb-2 pr-8">{post.content}</p>
                      {post.image_url && (
                        <div className="mb-2">
                          {post.image_url.includes('.mp4') || post.image_url.includes('.webm') ? (
                            <video src={post.image_url} className="w-full h-32 object-cover rounded" />
                          ) : (
                            <img src={post.image_url} alt="Post" className="w-full h-32 object-cover rounded" />
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{getRelativeTime(post.created_at)}</span>
                        <div className="flex items-center space-x-2">
                          <span>❤️ {post.likes_count || 0}</span>
                          <span>💬 {post.comments_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No posts yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}