import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
