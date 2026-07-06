import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { RefreshCw } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm text-gray-500 font-medium">Loading...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
