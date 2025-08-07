import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import ImageGenerator from '../../components/ai/ImageGenerator';

export default function ImageGeneratorPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="pt-20 pb-6">
          <ImageGenerator />
        </div>
      </div>
    </ProtectedRoute>
  );
}