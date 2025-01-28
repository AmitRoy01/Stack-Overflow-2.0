import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NavBar({ onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 shadow-lg">      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/posts" className="text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">
            📄 Posts
          </Link>
          <Link to="/notifications" className="text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">
            🔔 Notifications
          </Link>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default NavBar;