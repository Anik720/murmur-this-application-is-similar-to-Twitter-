import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';


const Sidebar: React.FC = () => {
  const { user, clearAuth } = useAuthStore(); // Use clearAuth instead of setUser, setToken
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth(); // Clears both user and token
    localStorage.setItem('access_token',JSON.stringify(null)); // Replace localStorage.setItem('access_token', null)
    localStorage.setItem('access_token',JSON.stringify(null));
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
        {(user || JSON.parse(localStorage.getItem('access_token') as string) !== null ) && (
          <Link
            to={`/users/${user?.id || JSON.parse(localStorage.getItem('user_info') as string).id}`}
            className="block text-lg text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
          >
            Profile
          </Link>
        )}
        {(user || JSON.parse(localStorage.getItem('access_token') as string) !== null ) && (
          <button
            onClick={handleLogout}
            className="block text-lg text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded w-full text-left"
          >
            Logout
          </button>
        )}
        {(user || JSON.parse(localStorage.getItem('access_token') as string) == null )&& (
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