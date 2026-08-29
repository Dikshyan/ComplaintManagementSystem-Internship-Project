import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../services/client';

export function ProtectedRoute({ children, roleRequired }) {
  const currentUser = getCurrentUser();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please sign in to access this page', { toastId: 'unauth-access-error' });
    } else if (roleRequired && currentUser.role !== roleRequired) {
      const msg = roleRequired === 'user'
        ? 'Filing grievances is reserved for public citizens'
        : `Access restricted to ${roleRequired} accounts`;
      toast.error(msg, { toastId: 'role-access-error' });
    }
  }, [currentUser, roleRequired]);

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired && currentUser.role !== roleRequired) {
    const fallbackPath = currentUser.role === 'admin' ? '/admin' : currentUser.role === 'staff' ? '/staff' : '/';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
