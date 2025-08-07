import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface GenerationResult {
  success: boolean;
  filename?: string;
  url?: string;
  prompt?: string;
  style?: string;
  error?: string;
}

export default function ScarletWitch() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photographic');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const { user } = useAuthStore();

  const styles = [
    'photographic', 'anime', 'digital-art', 'neon-punk',
    'fantasy-art', 'pixel-art', 'isometric', 'low-poly'
  ];

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResults([]);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getAPIBaseURL()}/api/v1/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          count
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.results) {
          setResults(data.results);
        } else if (data.result) {
          setResults([data.result]);
        }
      } else {
        alert(data.message || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 rounded-lg mb-4">
          <h1 className="text-3xl font-bold mb-2">🔮 Scarlet Witch</h1>
          <p className="text-lg opacity-90">AI-Powered Image Synthesis Engine</p>
          <p className="text-sm opacity-75 mt-2">Powered by Karu Teens Productions</p>
        </div>
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your vision
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A mystical forest with glowing mushrooms, fantasy art style..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Art Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {styles.map(s => (
                  <option key={s} value={s}>
                    {s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Images
              </label>
              <select
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>1 Image</option>
                <option value={2}>2 Images</option>
                <option value={3}>3 Images</option>
                <option value={4}>4 Images</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateImage}
            disabled={!prompt.trim() || loading}
            className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white py-3 px-6 rounded-md font-medium hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Conjuring Magic...</span>
              </div>
            ) : (
              '✨ Generate Images'
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                {result.success && result.url ? (
                  <div>
                    <img
                      src={`${getAPIBaseURL()}${result.url}`}
                      alt={result.prompt}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-3 bg-gray-50">
                      <p className="text-sm text-gray-600 truncate">
                        Style: {result.style}
                      </p>
                      <a
                        href={`${getAPIBaseURL()}${result.url}`}
                        download={result.filename}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-red-600">
                    <p>Generation failed</p>
                    <p className="text-sm">{result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Powered by Stability AI • Enhanced by Karu Teens Productions</p>
        <p className="mt-1">Create stunning AI-generated artwork with Scarlet Witch</p>
      </div>
    </div>
  );
}