import { useState } from 'react';
import { useAuth } from '../../hooks/useSupabase';

export default function FeedbackForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'feedback',
    message: '',
    anonymous: true,
    email: user?.email || '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://formspree.io/f/xgvzrqgj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          message: formData.message,
          email: formData.anonymous ? 'anonymous@student.com' : (formData.email || 'no-email@student.com'),
          name: formData.anonymous ? 'Anonymous Student' : (formData.name || 'Student'),
          anonymous: formData.anonymous,
          timestamp: new Date().toISOString(),
          platform: 'Karu Teens Social Platform'
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ ...formData, message: '' });
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your {formData.type} has been sent successfully. We appreciate your input!
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📝 Student Feedback</h2>
        <p className="text-gray-600">Help us improve the platform by sharing your thoughts</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Feedback Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'feedback' })}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                formData.type === 'feedback'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <span className="text-2xl mb-2 block">💡</span>
              <span className="font-medium">Feedback</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'complaint' })}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                formData.type === 'complaint'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <span className="text-2xl mb-2 block">⚠️</span>
              <span className="font-medium">Complaint</span>
            </button>
          </div>
        </div>

        {/* Anonymous Toggle */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.anonymous}
              onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Submit Anonymously</span>
              <p className="text-sm text-gray-600">Your identity will be hidden</p>
            </div>
          </label>
        </div>

        {/* Contact Info (if not anonymous) */}
        {!formData.anonymous && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (Optional)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your {formData.type === 'feedback' ? 'Feedback' : 'Complaint'}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={`Share your ${formData.type === 'feedback' ? 'suggestions and ideas' : 'concerns and issues'}...`}
            rows={6}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.message.trim() || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-bold text-lg"
        >
          {loading ? '📤 Sending...' : `🚀 Send ${formData.type === 'feedback' ? 'Feedback' : 'Complaint'}`}
        </button>
      </form>
    </div>
  );
}