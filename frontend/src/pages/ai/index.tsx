import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import Link from 'next/link';

export default function AIPage() {
  const aiTools = [
    {
      name: 'Scarlet Witch',
      description: 'AI-powered image generation with multiple art styles',
      icon: '🔮',
      color: 'from-red-600 to-purple-600',
      href: '/ai/scarlet-witch'
    },
    {
      name: 'Text Generator',
      description: 'Generate creative text content and stories',
      icon: '📝',
      color: 'from-blue-600 to-indigo-600',
      href: '/ai/text-generator'
    },
    {
      name: 'Smart Analysis',
      description: 'Analyze sentiment, keywords, and content insights',
      icon: '🧠',
      color: 'from-green-600 to-teal-600',
      href: '/ai/smart-analysis'
    },
    {
      name: 'Speech Tools',
      description: 'Speech-to-text and voice processing',
      icon: '🎤',
      color: 'from-yellow-600 to-orange-600',
      href: '/ai/speech-tools'
    },
    {
      name: 'Content Moderation',
      description: 'Moderate and filter content automatically',
      icon: '🛡️',
      color: 'from-red-600 to-pink-600',
      href: '/ai/moderation'
    },
    {
      name: 'Utilities',
      description: 'QR codes, weather, URL shortener, password checker',
      icon: '🔧',
      color: 'from-gray-600 to-slate-600',
      href: '/ai/utilities'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Tools Hub</h1>
            <p className="text-xl text-gray-600">Powered by Karu Teens Productions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool) => (
              <Link key={tool.name} href={tool.href}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  <div className={`bg-gradient-to-r ${tool.color} p-6 text-white`}>
                    <div className="text-4xl mb-2">{tool.icon}</div>
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600">{tool.description}</p>
                    <div className="mt-4">
                      <span className="text-blue-600 font-medium hover:text-blue-800">
                        Launch Tool →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}