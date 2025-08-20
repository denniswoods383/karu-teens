import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import EditProfileModal from '../../components/profile/EditProfileModal';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0, likes: 0, posts: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadPosts();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const newProfile = {
          id: user?.id,
          username: user?.email?.split('@')[0] || 'student',
          full_name: 'Student',
          created_at: new Date().toISOString()
        };
        
        const { data: createdProfile } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
        
        setProfile(createdProfile || newProfile);
      } else {
        setProfile(data || { id: user?.id, username: user?.email?.split('@')[0] });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Count posts
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Count likes received
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .in('post_id', posts.map(p => p.id));

      // Count followers
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user?.id);

      // Count following
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user?.id);

      setStats({
        posts: postsCount || 0,
        likes: likesCount || 0,
        followers: followersCount || 0,
        following: followingCount || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          avatar_url: result.url,
          username: profile?.username || user?.email?.split('@')[0] || 'student',
          full_name: profile?.full_name || 'Student'
        })
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
        console.log('Photo uploaded successfully:', data);
      } else {
        console.error('Photo upload error:', error);
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (!error) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        loadStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100">
        <AutoHideNavbar />
        
        <div className="pt-20 pb-8 max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    '🎓'
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 shadow-lg"
                >
                  {uploading ? '⏳' : '📷'}
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile?.full_name || 'Student'}
                </h1>
                <p className="text-xl text-blue-600 mb-4">@{profile?.username || user?.email?.split('@')[0]}</p>
                
                {profile?.bio && (
                  <p className="text-gray-600 mb-4">{profile.bio}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.posts}</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.following}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.likes}</div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h2>
            
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <div key={post.id} className="bg-gray-50 rounded-2xl p-4 relative group">
                    <button
                      onClick={() => deletePost(post.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:bg-red-600"
                    >
                      🗑️
                    </button>
                    
                    {post.image_url && (
                      <div className="mb-3">
                        {post.image_url.includes('.mp4') || post.image_url.includes('.webm') ? (
                          <video src={post.image_url} className="w-full h-40 object-cover rounded-lg" />
                        ) : (
                          <img src={post.image_url} alt="Post" className="w-full h-40 object-cover rounded-lg" />
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-800 text-sm mb-2 line-clamp-3">{post.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📝</span>
                <p className="text-gray-500 text-lg">No posts yet</p>
                <p className="text-gray-400">Share your first post to get started!</p>
              </div>
            )}
          </div>
        </div>

        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profile}
          onSave={(updatedProfile) => {
            setProfile(updatedProfile);
            setShowEditModal(false);
          }}
        />
      </div>
    </ProtectedRoute>
  );
}