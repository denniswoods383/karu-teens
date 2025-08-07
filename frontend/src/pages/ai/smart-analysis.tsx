import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useState } from 'react';
import { getAPIBaseURL } from '../../utils/ipDetection';

export default function SmartAnalysisPage() {
  const [text, setText] = useState('');
  const [analysisType, setAnalysisType] = useState('sentiment');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = {
        sentiment: 'analyze-sentiment',
        keywords: 'extract-keywords',
        summary: 'summarize',
        grammar: 'check-grammar'
      }[analysisType];

      const response = await fetch(`${getAPIBaseURL()}/api/v1/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data.result, null, 2) || 'Analysis failed');
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
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg mb-6">
            <h1 className="text-3xl font-bold mb-2">🧠 Smart Analysis</h1>
            <p className="opacity-90">Analyze sentiment, keywords, and content insights</p>
            <p className="text-sm opacity-75 mt-2">Powered by Karu Teens Productions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text to analyze
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to analyze..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Type
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="sentiment">Sentiment Analysis</option>
                  <option value="keywords">Keyword Extraction</option>
                  <option value="summary">Text Summarization</option>
                  <option value="grammar">Grammar Check</option>
                </select>
              </div>

              <button
                onClick={analyzeText}
                disabled={!text.trim() || loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </button>

              {result && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Analysis Result:</h3>
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