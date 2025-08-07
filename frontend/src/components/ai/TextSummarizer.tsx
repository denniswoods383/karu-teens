import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState } from 'react';

export default function TextSummarizer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const summarizeText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setResult(JSON.stringify(data, null, 2));
      } else {
        const errorMsg = data.detail || data.error || 'Something went wrong';
        setResult(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }
    } catch (error) {
      setResult('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            ⚡ The Flash
            <span className="text-lg font-normal text-gray-500">(Speed Reader)</span>
          </h1>
          <p className="text-gray-600 mt-2">Quickly summarize long text at super speed</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long text to summarize:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your long text here for super-fast summarization..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={6}
            />
          </div>

          <button
            onClick={summarizeText}
            disabled={loading || !text.trim()}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                The Flash is speed reading...
              </>
            ) : (
              <>⚡ Summarize at Super Speed</>
            )}
          </button>

          {result && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                The Flash's Lightning Summary:
              </label>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm">
                  {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}