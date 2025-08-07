import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useState } from 'react';
import { getAPIBaseURL } from '../../utils/ipDetection';

export default function ModerationPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const moderateContent = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/ai/moderate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data.result, null, 2) || 'Moderation failed');
    } catch (error) {
      setResult('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-lg mb-6">
            <h1 className="text-3xl font-bold mb-2">🛡️ Content Moderation</h1>
            <p className="opacity-90">Moderate and filter content automatically</p>
            <p className="text-sm opacity-75 mt-2">Powered by Karu Teens Productions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content to moderate
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter content to check for inappropriate material..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                />
              </div>

              <button
                onClick={moderateContent}
                disabled={!text.trim() || loading}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Moderate Content'}
              </button>

              {result && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Moderation Result:</h3>
                  <pre className="text-gray-700 whitespace-pre-wrap text-sm">{result}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}