import { useState } from 'react';
import { User } from '../../types/auth';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await fetch(`http://10.0.0.122:8001/api/v1/users/search/${searchQuery}`);
      const users = await response.json();
      setResults(users);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed');
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search users..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      />
      
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
          {results.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                window.location.href = `/profile/${user.id}`;
                setShowResults(false);
              }}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user.full_name || user.username}</p>
                <p className="text-sm text-gray-600">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}