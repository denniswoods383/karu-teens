import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useState } from 'react';
import { getAPIBaseURL } from '../../utils/ipDetection';

export default function UtilitiesPage() {
  const [activeTab, setActiveTab] = useState('qr');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const utilities = {
    qr: { name: 'QR Generator', endpoint: 'generate-qr', placeholder: 'Enter text or URL for QR code' },
    weather: { name: 'Weather', endpoint: 'weather', placeholder: 'Enter city name' },
    url: { name: 'URL Shortener', endpoint: 'shorten-url', placeholder: 'Enter URL to shorten' },
    password: { name: 'Password Checker', endpoint: 'check-password', placeholder: 'Enter password to check strength' }
  };

  const processUtility = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const utility = utilities[activeTab as keyof typeof utilities];
      const body = activeTab === 'weather' ? { city: input } : 
                   activeTab === 'url' ? { url: input } : { text: input };

      const response = await fetch(`${getAPIBaseURL()}/api/v1/ai/${utility.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data.result, null, 2) || 'Processing failed');
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
          <div className="bg-gradient-to-r from-gray-600 to-slate-600 text-white p-6 rounded-lg mb-6">
            <h1 className="text-3xl font-bold mb-2">🔧 AI Utilities</h1>
            <p className="opacity-90">QR codes, weather, URL shortener, password checker</p>
            <p className="text-sm opacity-75 mt-2">Powered by Karu Teens Productions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
              {Object.entries(utilities).map(([key, util]) => (
                <button
                  key={key}
                  onClick={() => {setActiveTab(key); setResult(''); setInput('');}}
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    activeTab === key 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {util.name}
                </button>
              ))}
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {utilities[activeTab as keyof typeof utilities].name} Input
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={utilities[activeTab as keyof typeof utilities].placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <button
                  onClick={processUtility}
                  disabled={!input.trim() || loading}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Generate ${utilities[activeTab as keyof typeof utilities].name}`}
                </button>

                {result && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Result:</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap text-sm">{result}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}