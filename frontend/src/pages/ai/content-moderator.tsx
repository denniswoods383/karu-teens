import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import ContentModerator from '../../components/ai/ContentModerator';

export default function ContentModeratorPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="pt-20 pb-6">
          <ContentModerator />
        </div>
      </div>
    </ProtectedRoute>
  );
}