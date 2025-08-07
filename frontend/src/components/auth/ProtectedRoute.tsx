import { getAPIBaseURL } from '../../utils/ipDetection';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../utils/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      // Verify token and get user data
      fetch(`${getAPIBaseURL()}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            login(token, data);
          } else {
            logout();
            window.location.href = '/auth/login';
          }
        })
        .catch(() => {
          logout();
          window.location.href = '/auth/login';
        })
        .finally(() => setLoading(false));
    } else if (!token) {
      logout();
      window.location.href = '/auth/login';
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}