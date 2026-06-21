import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, LogOut, User, CheckSquare } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 dark:text-blue-400">
          <CheckSquare size={24} />
          <span>TaskManager</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1">
            <span>Tasks</span>
          </Link>
          <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1">
            <User size={18} />
            <span>Profile</span>
          </Link>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full flex items-center space-x-1"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;