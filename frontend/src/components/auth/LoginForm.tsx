import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { LoginData, AuthResponse } from '../../types/auth';
import { getAPIBaseURL } from '../../utils/ipDetection';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const login = useAuthStore((state) => state.login);

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (response.ok) {
        login(result.access_token, result.user);
        window.location.href = '/feed';
      } else {
        setError(result.detail || 'Login failed');
      }
    } catch (err: any) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-6 text-center space-y-3">
        <button 
          onClick={() => window.location.href = '/auth/forgot-password'}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Forgot your password?
        </button>
        
        <div className="border-t border-gray-300 pt-3">
          <p className="text-gray-600 text-sm mb-2">New here?</p>
          <button 
            onClick={() => window.location.href = '/auth/register'}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}