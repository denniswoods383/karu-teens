import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import ResponsiveLayout from '../../components/layout/ResponsiveLayout';
import ProfilePhoto from '../../components/user/ProfilePhoto';
import PostCard from '../../components/posts/PostCard';
import { useAuthStore } from '../../store/authStore';
import { Post } from '../../types/post';

interface UserProfile {
  id: number;
  username: string;
  full_name: string;
  email: string;
  bio?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadProfile();
      loadUserPosts();
      loadBadges();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/profile/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        // Fallback to user data
        setProfile({
          id: user.id,
          username: user.username,
          full_name: user.full_name || user.username,
          email: user.email,
          bio: '',
          posts_count: 0,
          followers_count: 0,
          following_count: 0
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/posts/user/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } else {
        // Fallback: load all posts and filter by user
        const allPostsResponse = await fetch(`${getAPIBaseURL()}/api/v1/posts/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (allPostsResponse.ok) {
          const allPosts = await allPostsResponse.json();
          const userPosts = allPosts.filter((post: any) => post.author.id === user?.id);
          setPosts(userPosts);
        } else {
          setPosts([]);
        }
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    }
  };

  const loadBadges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/users/${user?.id}/badges`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBadges(data);
      }
    } catch (error) {
      console.error('Failed to load badges');
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/upload/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update user profile photo
        await fetch(`${getAPIBaseURL()}/api/v1/profile/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ profile_photo: data.url })
        });
        
        loadProfile();
      }
    } catch (error) {
      console.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (!profile) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <ResponsiveLayout className="bg-gradient-3">
        <AutoHideNavbar />
        
        <div className="pt-16 sm:pt-20 pb-6 pb-20 lg:pb-6">
          {/* Profile Photo Update Button - Always Visible */}
          <div className="mb-4 text-center">
            <button 
              onClick={() => setShowPhotoModal(true)}
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 font-bold text-lg shadow-xl"
            >
              🔥 CHANGE PROFILE PHOTO 🔥
            </button>
          </div>
          
          {/* Cover Photo */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 h-32 sm:h-48 md:h-64 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-2 sm:bottom-4 left-3 sm:left-6">
              <div className="relative">
                <ProfilePhoto 
                  userId={profile.id}
                  username={profile.username}
                  profilePhoto={profile.profile_photo}
                  size="xl"
                  showBadges={true}
                  className="border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-lg">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file);
                    }}
                    className="hidden"
                  />
                </label>
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
            {/* Profile Info */}
            <div className="pt-16 px-6 pb-6 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.full_name || profile.username}</h1>
                  <p className="text-gray-600 text-lg">@{profile.username}</p>
                  <p className="text-blue-600 mt-1">Computer Science Student | Web Developer</p>
                  <p className="text-gray-700 mt-3 max-w-2xl">Passionate about technology and innovation. Building the future one line of code at a time. 🚀</p>
                  
                  <div className="flex items-center space-x-4 mt-4 text-gray-600">
                    <span className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>Nairobi, Kenya</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>Joined {new Date().getFullYear()}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 sm:gap-6 mt-6">
                    <div className="text-center">
                      <p className="font-bold text-xl sm:text-2xl text-gray-900">{profile.posts_count}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl sm:text-2xl text-gray-900">{profile.followers_count}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl sm:text-2xl text-gray-900">{profile.following_count}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl sm:text-2xl text-gray-900">{badges.length}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Badges</p>
                    </div>
                  </div>

                  {/* Badges Display */}
                  {badges.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Achievements</h3>
                      <div className="flex flex-wrap gap-2">
                        {badges.slice(0, 8).map((badge: any) => (
                          <div
                            key={badge.id}
                            className="flex items-center space-x-2 px-3 py-2 rounded-full text-white text-sm font-medium shadow-sm"
                            style={{ backgroundColor: badge.color }}
                            title={badge.description}
                          >
                            <span>{badge.icon}</span>
                            <span>{badge.name}</span>
                          </div>
                        ))}
                        {badges.length > 8 && (
                          <div className="flex items-center px-3 py-2 bg-gray-200 rounded-full text-gray-700 text-sm font-medium">
                            +{badges.length - 8} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowPhotoModal(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 transition-all"
                  >
                    📷 Update Profile Photo
                  </button>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg transform hover:scale-105 transition-all"
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Skills & Interests</h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'JavaScript', 'React', 'Node.js', 'UI/UX', 'Photography', 'Gaming'].map((skill) => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity Tabs */}
            <div className="border-b">
              <div className="flex space-x-8 px-6">
                <button className="py-4 border-b-2 border-blue-600 text-blue-600 font-medium">
                  Posts ({profile.posts_count})
                </button>
                <button className="py-4 text-gray-500 hover:text-gray-700">
                  Media
                </button>
                <button className="py-4 text-gray-500 hover:text-gray-700">
                  Likes
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="p-3 sm:p-6">
              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post: Post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Share your first post to get started!</p>
                  <button 
                    onClick={() => window.location.href = '/feed'}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Photo Update Modal */}
        {showPhotoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Update Profile Photo</h3>
                <button 
                  onClick={() => setShowPhotoModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-center">
                <div className="mb-4">
                  <ProfilePhoto 
                    userId={profile.id}
                    username={profile.username}
                    profilePhoto={profile.profile_photo}
                    size="xl"
                    showBadges={false}
                    className="mx-auto"
                  />
                </div>
                
                <label className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
                  {uploadingPhoto ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      📷 Choose New Photo
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handlePhotoUpload(file);
                        setShowPhotoModal(false);
                      }
                    }}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
                
                <p className="text-sm text-gray-500 mt-3">
                  Choose a photo that represents you. Max size: 50MB
                </p>
              </div>
            </div>
          </div>
        )}
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}