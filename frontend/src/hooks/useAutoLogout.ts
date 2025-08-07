import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const AUTO_LOGOUT_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export const useAutoLogout = () => {
  const { logout } = useAuthStore();

  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    
    if (loginTime) {
      const timeElapsed = Date.now() - parseInt(loginTime);
      
      if (timeElapsed >= AUTO_LOGOUT_TIME) {
        // Already past 12 hours, logout immediately
        logout();
        return;
      }
      
      // Set timeout for remaining time
      const remainingTime = AUTO_LOGOUT_TIME - timeElapsed;
      const timeoutId = setTimeout(() => {
        logout();
        alert('You have been automatically logged out after 12 hours for security.');
      }, remainingTime);
      
      return () => clearTimeout(timeoutId);
    }
  }, [logout]);

  // Set login time when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !localStorage.getItem('loginTime')) {
      localStorage.setItem('loginTime', Date.now().toString());
    }
  }, []);
};