import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState, useEffect } from 'react';

interface SearchResult {
  type: string;
  id: number;
  title: string;
  content: string;
  username?: string;
}

export default function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [trending, setTrending] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadTrending();
    loadSuggestions();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      searchContent();
    } else {
      setResults([]);
    }
  }, [query, activeTab]);

  const searchContent = async () => {
    try {
      const type = activeTab === 'all' ? '' : activeTab;
      const response = await fetch(`http://10.0.0.122:8001/api/v1/search/?q=${query}&type=${type}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed');
    }
  };

  const loadTrending = async () => {
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/v1/auth/login`);
      const data = await response.json();
      setTrending(data);
    } catch (error) {
      console.error('Failed to load trending');
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/v1/auth/login`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to load suggestions');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search Input */}
      <div className="p-4 border-b">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users, posts, hashtags..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Tabs */}
      <div className="flex border-b">
        {['all', 'users', 'posts', 'hashtags'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {query.length >= 2 ? (
        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={`${result.type}-${result.id}`} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {result.type === 'user' && <span className="text-blue-500">👤</span>}
                    {result.type === 'post' && <span className="text-green-500">📝</span>}
                    {result.type === 'hashtag' && <span className="text-purple-500">#</span>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{result.title}</h4>
                    <p className="text-sm text-gray-600">{result.content}</p>
                    {result.username && (
                      <p className="text-xs text-gray-500 mt-1">@{result.username}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          {/* Trending Hashtags */}
          {trending.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Trending</h3>
              <div className="space-y-2">
                {trending.slice(0, 5).map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => setQuery(`#${tag.name}`)}
                    className="block w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    <span className="font-medium text-blue-600">#{tag.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{tag.count} posts</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">People you may know</h3>
              <div className="space-y-2">
                {suggestions.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.full_name || user.username}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}