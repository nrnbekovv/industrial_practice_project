import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Profile = ({ darkMode, setDarkMode }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Profile</h1>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{user.username}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{user.email}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  Active
                </span>
              </div>
            </div>
          ) : (
            <p>Loading profile data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;