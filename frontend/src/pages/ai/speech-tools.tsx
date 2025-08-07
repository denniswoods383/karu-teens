import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import { useState } from 'react';
import { getAPIBaseURL } from '../../utils/ipDetection';

export default function SpeechToolsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const processAudio = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch(`${getAPIBaseURL()}/api/v1/ai/speech-to-text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      setResult(data.result || 'Processing failed');
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
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-lg mb-6">
            <h1 className="text-3xl font-bold mb-2">🎤 Speech Tools</h1>
            <p className="opacity-90">Speech-to-text and voice processing</p>
            <p className="text-sm opacity-75 mt-2">Powered by Karu Teens Productions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Audio File
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {file && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <button
                onClick={processAudio}
                disabled={!file || loading}
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md font-medium hover:bg-yellow-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Convert to Text'}
              </button>

              {result && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Transcription:</h3>
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