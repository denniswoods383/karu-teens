import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import ScarletWitch from '../../components/ai/ScarletWitch';

export default function ScarletWitchPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="pt-20 pb-6">
          <ScarletWitch />
        </div>
      </div>
    </ProtectedRoute>
  );
}