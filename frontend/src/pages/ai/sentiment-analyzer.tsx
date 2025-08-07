import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import SentimentAnalyzer from '../../components/ai/SentimentAnalyzer';

export default function SentimentAnalyzerPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="pt-20 pb-6">
          <SentimentAnalyzer />
        </div>
      </div>
    </ProtectedRoute>
  );
}