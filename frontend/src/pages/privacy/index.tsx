import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';

export default function PrivacyPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b">
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="p-6 prose max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We collect information you provide directly to us, such as:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Account information (username, email, profile details)</li>
                    <li>Posts, comments, and messages you create</li>
                    <li>Photos and media you upload</li>
                    <li>Information about your interactions with other users</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and maintain our social media platform</li>
                    <li>Enable you to connect and communicate with other users</li>
                    <li>Send you notifications about platform activity</li>
                    <li>Improve our services and develop new features</li>
                    <li>Ensure platform security and prevent abuse</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We may share your information in the following situations:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>With other users as part of the social features (posts, comments, follows)</li>
                    <li>With service providers who help us operate the platform</li>
                    <li>When required by law or to protect our rights</li>
                    <li>With your consent or at your direction</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                <div className="space-y-4 text-gray-700">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Delete your account and associated data</li>
                    <li>Control who can see your posts and profile</li>
                    <li>Opt out of certain communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We implement appropriate security measures to protect your information, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of sensitive data</li>
                    <li>Secure authentication systems</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <div className="space-y-4 text-gray-700">
                  <p>If you have questions about this Privacy Policy, please contact us at:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> privacy@socialplatform.com</p>
                    <p><strong>Address:</strong> 123 Social Street, Tech City, TC 12345</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}