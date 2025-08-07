import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function SimpleLogin() {
  const [email, setEmail] = useState('testuser3@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        login(data.access_token, data.user);
        setResult('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/feed';
        }, 500);
      } else {
        setResult('Error: ' + data.detail);
      }
    } catch (error) {
      setResult('Network Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Simple Login Test</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}