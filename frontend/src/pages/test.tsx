import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TestPage() {
  const [result, setResult] = useState('');

  const testAPI = async () => {
    try {
      const response = await fetch('/health');
      const data = await response.json();
      setResult('Success: ' + JSON.stringify(data));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'testuser3@example.com',
        password: 'password123'
      });
      
      if (error) {
        setResult('Login Error: ' + error.message);
      } else {
        setResult('Login Success: ' + JSON.stringify(data.user));
      }
    } catch (error) {
      setResult('Login Error: ' + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1>API Test</h1>
      <button onClick={testAPI} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
        Test API Connection
      </button>
      <button onClick={testLogin} className="bg-green-500 text-white px-4 py-2 rounded">
        Test Login
      </button>
      <div className="mt-4">
        <strong>Result:</strong> {result}
      </div>
    </div>
  );
}