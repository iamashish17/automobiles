import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAuthLoading, user, refreshUser } = useAuth();
  const location = useLocation();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated || isAuthLoading) {
      return undefined;
    }

    refreshUser()
      .catch(() => {})
      .finally(() => {
        if (active) setCheckingRole(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, isAuthLoading, refreshUser]);

  if (isAuthLoading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (checkingRole) {
    return <div className="min-h-screen bg-white" />;
  }

  if (String(user?.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
