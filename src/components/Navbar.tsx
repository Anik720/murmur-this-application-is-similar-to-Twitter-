import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const isAuthenticated =
    user || JSON.parse(localStorage.getItem('access_token') as string) !== null;

  // Debounced Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    // Cancel previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const delayDebounce = setTimeout(() => {
      fetch(`http://localhost:3001/api/users/search?query=${searchQuery}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => setSearchResults(data))
        .catch((err) => {
          if (err.name !== 'AbortError') console.error(err);
        })
        .finally(() => setLoading(false));
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleLogout = () => {
    clearAuth();
    localStorage.setItem('access_token', JSON.stringify(null));
    localStorage.setItem('user_info', JSON.stringify(null));
    navigate('/login');
  };

  const handleSelectUser = (id: number) => {
    navigate(`/users/${id}`);
    setSearchQuery('');
    setSearchResults([]);
    setMenuOpen(false);
  };

  // Hide dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Murmur
        </Link>

        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 dark:text-white"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {
            isAuthenticated && <div ref={searchBoxRef} className="relative w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user..."
                className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-100"
              />
              {loading && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  ...
                </span>
              )}
              {searchResults.length > 0 && (
                <ul className="absolute w-full mt-1 bg-white border rounded shadow dark:bg-gray-800 max-h-60 overflow-y-auto">
                  {searchResults.map((u) => (
                    <li
                      key={u.id}
                      onClick={() => handleSelectUser(u.id)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-dark dark:text-white"
                    >
                      {u.username} ({u.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          }


          {isAuthenticated ? (
            <>

              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-dark hover:text-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-4 bg-white dark:bg-gray-900">
          <div ref={searchBoxRef} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user..."
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-100"
            />
            {searchResults.length > 0 && (
              <ul className="absolute w-full mt-1 bg-white border rounded shadow dark:bg-gray-800 max-h-60 overflow-y-auto z-50">
                {searchResults.map((u) => (
                  <li
                    key={u.id}
                    onClick={() => handleSelectUser(u.id)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-dark dark:text-white"
                  >
                    {u.username} ({u.email})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/users/${user?.id}`}
                  className="text-dark dark:text-white hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {user?.name || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-dark hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
