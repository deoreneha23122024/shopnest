import React from 'react';
import { Link } from 'react-router-dom';
import { Train, UserCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <nav className="bg-orange-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Train className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">RailOne</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/search" className="hover:text-orange-200 transition-colors font-medium">Search Trains</Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center gap-2 bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded-md transition-colors font-medium">
                <UserCircle className="w-5 h-5" />
                <span>{user?.name || 'Dashboard'}</span>
              </Link>
            ) : (
              <button className="bg-white text-orange-600 hover:bg-orange-50 px-5 py-2 rounded-md font-bold shadow-sm transition-colors">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
