import { getAPIBaseURL } from './ipDetection';

// Token refresh utility
export const refreshTokenIfNeeded = async () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // Check if token is still valid
    const response = await fetch(`${getAPIBaseURL()}/api/v1/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// Token validation can be called manually when needed
// setInterval removed to prevent SSR issues