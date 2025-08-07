import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AutoHideNavbar from '../../components/layout/AutoHideNavbar';
import WeatherTool from '../../components/ai/WeatherTool';

export default function WeatherPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AutoHideNavbar />
        
        <div className="pt-20 pb-6">
          <WeatherTool />
        </div>
      </div>
    </ProtectedRoute>
  );
}