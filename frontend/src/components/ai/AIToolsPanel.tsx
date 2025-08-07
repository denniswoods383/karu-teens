import { useState, useEffect } from 'react';
import { refreshTokenIfNeeded } from '../../utils/tokenManager';

interface AITool {
  id: string;
  name: string;
  character: string;
  description: string;
  icon: string;
  endpoint: string;
}

const aiTools: AITool[] = [
  {
    id: 'text-gen',
    name: 'Jarvis',
    character: 'Iron Man\'s AI Assistant',
    description: 'Generate intelligent text responses',
    icon: '🤖',
    endpoint: '/ai/generate-text'
  },
  {
    id: 'content-mod',
    name: 'Professor X',
    character: 'Mind Reader',
    description: 'Detect toxic content and thoughts',
    icon: '🧠',
    endpoint: '/ai/moderate-content'
  },
  {
    id: 'speech-text',
    name: 'Black Canary',
    character: 'Sonic Scream',
    description: 'Convert speech to text',
    icon: '🎤',
    endpoint: '/ai/speech-to-text'
  },
  {
    id: 'image-gen',
    name: 'Scarlet Witch',
    character: 'Reality Manipulation',
    description: 'Create images from imagination',
    icon: '🎨',
    endpoint: '/ai/generate-image'
  },
  {
    id: 'sentiment',
    name: 'Mantis',
    character: 'Emotion Reader',
    description: 'Analyze emotional sentiment',
    icon: '😊',
    endpoint: '/ai/analyze-sentiment'
  },
  {
    id: 'summarize',
    name: 'The Flash',
    character: 'Speed Reader',
    description: 'Quickly summarize long text',
    icon: '⚡',
    endpoint: '/ai/summarize'
  },
  {
    id: 'keywords',
    name: 'Oracle',
    character: 'Information Gatherer',
    description: 'Extract key information',
    icon: '🔍',
    endpoint: '/ai/extract-keywords'
  },
  {
    id: 'grammar',
    name: 'Cyborg',
    character: 'Perfect Processor',
    description: 'Check grammar and spelling',
    icon: '✏️',
    endpoint: '/ai/check-grammar'
  },
  {
    id: 'qr-code',
    name: 'Vision',
    character: 'Pattern Recognition',
    description: 'Generate QR codes',
    icon: '📱',
    endpoint: '/ai/generate-qr'
  },
  {
    id: 'weather',
    name: 'Storm',
    character: 'Weather Controller',
    description: 'Get weather information',
    icon: '🌤️',
    endpoint: '/ai/weather'
  },
  {
    id: 'url-short',
    name: 'Ant-Man',
    character: 'Size Reducer',
    description: 'Shrink long URLs',
    icon: '🔗',
    endpoint: '/ai/shorten-url'
  },
  {
    id: 'password',
    name: 'Batman',
    character: 'Security Expert',
    description: 'Check password security',
    icon: '🛡️',
    endpoint: '/ai/check-password'
  }
];

export default function AIToolsPanel() {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshTokenIfNeeded();
  }, []);

  const handleToolSelect = (tool: AITool) => {
    setSelectedTool(tool);
    setInput('');
    setResult('');
  };

  const handleSubmit = async () => {
    if (!selectedTool || !input.trim()) return;
    
    const isTokenValid = await refreshTokenIfNeeded();
    if (!isTokenValid) {
      setResult('Session expired. Please login again.');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1${selectedTool.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
          selectedTool.id === 'text-gen' ? { prompt: input } :
          selectedTool.id === 'image-gen' ? { prompt: input } :
          selectedTool.id === 'weather' ? { city: input } :
          selectedTool.id === 'url-short' ? { url: input } :
          { text: input }
        )
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">🦸♂️ Hero AI Tools 🦸♀️</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {aiTools.map((tool) => (
          <div key={tool.id} className="relative">
            <button
              onClick={() => handleToolSelect(tool)}
              className={`w-full p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedTool?.id === tool.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-3xl mb-2">{tool.icon}</div>
              <div className="font-bold text-sm">{tool.name}</div>
              <div className="text-xs text-gray-500 mb-1">{tool.character}</div>
              <div className="text-xs text-gray-600">{tool.description}</div>
            </button>
            <button
              onClick={() => {
                const routes = {
                  'text-gen': '/ai/text-generator',
                  'image-gen': '/ai/image-generator',
                  'weather': '/ai/weather',
                  'content-mod': '/ai/content-moderator',
                  'speech-text': '/ai/speech-to-text',
                  'sentiment': '/ai/sentiment-analyzer',
                  'summarize': '/ai/summarizer'
                };
                if (routes[tool.id]) {
                  window.location.href = routes[tool.id];
                }
              }}
              className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-700"
              title="Open dedicated page"
            >
              🔗
            </button>
          </div>
        ))}
      </div>

      {selectedTool && (
        <div className="border-t pt-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              {selectedTool.icon} {selectedTool.name}
              <span className="text-sm font-normal text-gray-500">({selectedTool.character})</span>
            </h3>
            <p className="text-gray-600">{selectedTool.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedTool.id === 'weather' ? 'City Name:' :
                 selectedTool.id === 'url-short' ? 'URL to Shorten:' :
                 selectedTool.id === 'text-gen' ? 'Your Prompt:' :
                 'Input Text:'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedTool.id === 'weather' ? 'Enter city name (e.g., Nairobi)' :
                  selectedTool.id === 'url-short' ? 'Enter URL to shorten' :
                  selectedTool.id === 'text-gen' ? 'Ask me anything...' :
                  'Enter your text here...'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {selectedTool.name} is working...
                </>
              ) : (
                <>Activate {selectedTool.name}</>
              )}
            </button>

            {result && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedTool.name}'s Response:
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
      )}
    </div>
  );
}