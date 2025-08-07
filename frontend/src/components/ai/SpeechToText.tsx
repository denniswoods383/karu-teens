import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState } from 'react';

export default function SpeechToText() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch(`${getAPIBaseURL()}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
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
            🎤 Black Canary
            <span className="text-lg font-normal text-gray-500">(Sonic Scream)</span>
          </h1>
          <p className="text-gray-600 mt-2">Convert speech to text using her sonic powers</p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Audio File</h3>
            <p className="text-gray-500 mb-4">Supported formats: MP3, WAV, M4A, FLAC</p>
            
            <label className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Black Canary is listening...
                </div>
              ) : (
                <>🎤 Choose Audio File</>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {result && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Black Canary's Transcription:
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