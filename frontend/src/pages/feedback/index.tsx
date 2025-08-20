import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import FeedbackForm from '../../components/feedback/FeedbackForm';

export default function FeedbackPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100">
        <AutoHideNavbar />
        
        <div className="pt-20 pb-8 px-4">
          <FeedbackForm />
        </div>
        
        {/* Info Section */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <span className="text-3xl mb-3 block">🔒</span>
              <h3 className="font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">Your feedback is sent securely and handled with care</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <span className="text-3xl mb-3 block">👥</span>
              <h3 className="font-bold text-gray-900 mb-2">Anonymous Option</h3>
              <p className="text-sm text-gray-600">Choose to submit feedback without revealing your identity</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <span className="text-3xl mb-3 block">⚡</span>
              <h3 className="font-bold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600">We review all feedback and respond when needed</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}