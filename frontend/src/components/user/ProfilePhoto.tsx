import { useState, useEffect } from 'react';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface ProfilePhotoProps {
  userId: number;
  username: string;
  profilePhoto?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadges?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-xl'
};

const badgeSizes = {
  sm: 'w-3 h-3 text-xs',
  md: 'w-4 h-4 text-xs',
  lg: 'w-5 h-5 text-sm',
  xl: 'w-6 h-6 text-sm'
};

export default function ProfilePhoto({ 
  userId, 
  username, 
  profilePhoto: propProfilePhoto, 
  size = 'md', 
  showBadges = true,
  className = '' 
}: ProfilePhotoProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(propProfilePhoto || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propProfilePhoto) {
      setProfilePhoto(propProfilePhoto);
    } else if (userId && !loading) {
      loadUserPhoto();
    }
    
    if (showBadges) {
      loadUserBadges();
    }
  }, [userId, propProfilePhoto, showBadges]);

  const loadUserPhoto = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setProfilePhoto(userData.profile_photo || null);
      }
    } catch (error) {
      console.error('Failed to load user photo');
    } finally {
      setLoading(false);
    }
  };

  const loadUserBadges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/users/${userId}/badges`, {
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

  const topBadges = badges.slice(0, 3);
  const remainingCount = badges.length - 3;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Profile Photo */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg`}>
        {profilePhoto && profilePhoto !== 'null' && profilePhoto !== '' ? (
          <img 
            src={profilePhoto} 
            alt={username}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to letter if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling!.style.display = 'flex';
            }}
          />
        ) : null}
        <span 
          className={`${profilePhoto && profilePhoto !== 'null' && profilePhoto !== '' ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
        >
          {username[0]?.toUpperCase()}
        </span>
      </div>

      {/* Badges */}
      {showBadges && badges.length > 0 && (
        <div className="absolute -bottom-1 -right-1 flex items-center">
          {/* Top badges */}
          <div className="flex -space-x-1">
            {topBadges.map((badge, index) => (
              <div
                key={badge.id}
                className={`${badgeSizes[size]} rounded-full flex items-center justify-center shadow-sm border-2 border-white`}
                style={{ backgroundColor: badge.color }}
                title={`${badge.name}: ${badge.description}`}
              >
                <span className="text-white">{badge.icon}</span>
              </div>
            ))}
          </div>

          {/* More badges indicator */}
          {remainingCount > 0 && (
            <div 
              className={`${badgeSizes[size]} rounded-full bg-gray-600 text-white flex items-center justify-center shadow-sm border-2 border-white ml-1 cursor-pointer`}
              onClick={() => setShowAllBadges(true)}
              title={`+${remainingCount} more badges`}
            >
              <span className="text-xs font-bold">+{remainingCount}</span>
            </div>
          )}
        </div>
      )}

      {/* All badges modal */}
      {showAllBadges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">@{username}'s Badges</h3>
                <button 
                  onClick={() => setShowAllBadges(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: badge.color }}
                  >
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{badge.name}</p>
                    <p className="text-xs text-gray-500 truncate">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}