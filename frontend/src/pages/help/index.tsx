import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';

export default function HelpPage() {
  const faqItems = [
    {
      question: "How do I create a post?",
      answer: "Click the 'What's on your mind?' box on your feed, type your message, and click 'Post'."
    },
    {
      question: "How do I follow comrades?",
      answer: "Go to the Comrades page and click 'nimekumark' next to users you want to follow."
    },
    {
      question: "How do I send messages?",
      answer: "Click on Messages in the navigation bar or click the message icon to start a conversation."
    },
    {
      question: "How do I edit my profile?",
      answer: "Click on your profile picture in the top right, then select 'Edit Profile'."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Click the three dots (⋯) on any post and select 'Report Post' to flag inappropriate content."
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="max-w-3xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b">
              <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-gray-600 mt-2">Find answers to common questions</p>
            </div>

            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">📧 Email Support</h3>
                  <p className="text-blue-700 mb-3">Get help via email</p>
                  <a href="mailto:support@socialplatform.com" className="text-blue-600 hover:underline">
                    support@socialplatform.com
                  </a>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-2">💬 Live Chat</h3>
                  <p className="text-green-700 mb-3">Chat with our support team</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Start Chat
                  </button>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🐛 Report a Bug</h3>
                <p className="text-gray-600 mb-4">Found an issue? Let us know!</p>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                  Report Bug
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}