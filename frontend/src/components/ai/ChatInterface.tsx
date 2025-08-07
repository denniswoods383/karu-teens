import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  heroName: string;
  heroIcon: string;
  heroTitle: string;
  placeholder: string;
  endpoint: string;
  requestKey: string; // 'prompt', 'text', 'city', etc.
}

export default function ChatInterface({ 
  heroName, 
  heroIcon, 
  heroTitle, 
  placeholder, 
  endpoint,
  requestKey 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm ${heroName}. ${heroTitle}. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [requestKey]: currentInput })
      });
      
      const data = await response.json();
      
      let aiResponse = '';
      if (response.ok && data.success) {
        // Extract meaningful response based on the tool
        if (data.text) {
          aiResponse = data.text;
        } else if (data.weather) {
          const weather = data.weather;
          aiResponse = `Weather in ${weather.name}: ${weather.weather[0].description}, Temperature: ${weather.main.temp}°C, Feels like: ${weather.main.feels_like}°C, Humidity: ${weather.main.humidity}%`;
        } else if (data.sentiment) {
          const sentiment = data.sentiment[0];
          aiResponse = `Sentiment Analysis: ${sentiment.label} (Confidence: ${(sentiment.score * 100).toFixed(1)}%)`;
        } else if (data.summary) {
          aiResponse = `Summary: ${data.summary}`;
        } else if (data.toxicity_score !== undefined) {
          aiResponse = `Content Analysis: ${data.is_toxic ? '⚠️ Toxic content detected' : '✅ Content appears safe'} (Toxicity score: ${(data.toxicity_score * 100).toFixed(1)}%)`;
        } else {
          aiResponse = JSON.stringify(data, null, 2);
        }
      } else {
        aiResponse = data.detail || data.error || 'Something went wrong';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Network error occurred. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
              title="Go back"
            >
              ←
            </button>
            <div className="text-3xl">{heroIcon}</div>
            <div>
              <h1 className="text-xl font-bold">{heroName}</h1>
              <p className="text-sm text-gray-600">{heroTitle}</p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">{heroName} is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}