import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import SpeechToText from '../../components/ai/SpeechToText';

export default function SpeechToTextPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="pt-20 pb-6">
          <SpeechToText />
        </div>
      </div>
    </ProtectedRoute>
  );
}