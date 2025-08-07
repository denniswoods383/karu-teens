import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useState } from 'react';
import { getAPIBaseURL } from '../../utils/ipDetection';

export default function TextGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [maxTokens, setMaxTokens] = useState(150);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateText = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/ai/generate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt, max_tokens: maxTokens })
      });
      
      const data = await response.json();
      setResult(data.result || 'Generation failed');
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-6">
            <h1 className="text-3xl font-bold mb-2">📝 Text Generator</h1>
            <p className="opacity-90">Generate creative text content and stories</p>
            <p className="text-sm opacity-75 mt-2">Powered by Karu Teens Productions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write a story about..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens: {maxTokens}
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={generateText}
                disabled={!prompt.trim() || loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Text'}
              </button>

              {result && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Generated Text:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}