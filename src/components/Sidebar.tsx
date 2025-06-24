import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { useQueryClient } from '@tanstack/react-query';

const Sidebar: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Fallback to localStorage if store doesn't have user (e.g., after reload)
  const storedUser = localStorage.getItem('user_info');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const accessToken = localStorage.getItem('access_token');

  const isLoggedIn = !!user || (!!parsedUser && !!accessToken);
const handleLogout = () => {

  const clearAuth = useAuthStore.getState().clearAuth;

  // ✅ Clear Zustand store
  clearAuth();

  // ✅ Clear React Query cache
  queryClient.clear();

  // ✅ Clear localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_info');

  // ✅ Redirect to login
  navigate('/login');
};

  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 h-screen fixed top-0 left-0">
      <h1 className="text-2xl font-bold mb-8 text-primary">Murmur</h1>
      <nav className="space-y-4">
        <Link
          to="/"
          className="block text-lg text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
        >
          Home
        </Link>

        {isLoggedIn && (
          <Link
            to={`/users/${user?.id || parsedUser?.id}`}
            className="block text-lg text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
          >
            Profile
          </Link>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="block text-lg text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded w-full text-left"
          >
            Logout
          </button>
        )}

        {!isLoggedIn && (
          <Link
            to="/login"
            className="block text-lg text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
