// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-domain.com' 
  : `${getAPIBaseURL()}`';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/v1/auth`,
  POSTS: `${API_BASE_URL}/api/v1/posts`,
  UPLOAD: `${API_BASE_URL}/api/v1/upload`,
  AI: `${API_BASE_URL}/api/v1/ai`,
  USERS: `${API_BASE_URL}/api/v1/users`,
  MESSAGES: `${API_BASE_URL}/api/v1/messages`
};