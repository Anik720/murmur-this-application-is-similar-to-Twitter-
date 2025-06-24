// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuthStore();

  if (!user && !JSON.parse(localStorage.getItem('access_token') as string)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
