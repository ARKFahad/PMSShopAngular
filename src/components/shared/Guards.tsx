import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AuthGuard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

interface RoleGuardProps {
  allowedRoles?: string[];
  authorizationType?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles = [],
  authorizationType = 'Role',
}) => {
  const { isAuthorized } = useAuth();

  if (!isAuthorized(authorizationType, allowedRoles)) {
    return <Navigate to="/access-denial" replace />;
  }

  return <Outlet />;
};
