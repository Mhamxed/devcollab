import { useState } from 'react';
import { Code, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useUser } from '../hooks/useUser';
import { User } from '../types/User';
const API = import.meta.env.VITE_SERVER_URL;

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, refreshUser, setRefreshUser } = useUser()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
        const res = await Axios.post(`${API}/api/auth/logout/`, {
            headers: { Authorization: `Bearer ${token}` }, // Headers
            withCblueentials: true, // Ensures cookies (if needed)
            validateStatus: function(status) {
                return true
            }
        })
        const data = res.data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setRefreshUser(!refreshUser)
        alert(data.message)
        navigate("/")
    } catch(err) {
        console.error(err)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-6 w-full">
        <div className="flex justify-between py-4">
          {/* Logo and navigation */}
          <div className="flex">
            <div className="flex items-center">
              {/* Logo */}
              <Link to={"/"}>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Code className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">DevCollab</span>
                </div>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Auth buttons */}
          <div className="hidden md:flex md:items-center md:ml-6">
            {user.username ? (
              <button className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-50"
              onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <div className="flex space-x-3">
                <Link to={"/login"}>
                    <button className="ml-4 px-3 py-2 rounded-md text-sm font-medium cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200">
                    Log in
                    </button>
                </Link>
                <Link to={"/register"}>
                    <button className="px-4 py-2 rounded-md border border-transparent text-sm font-medium cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
                    Register
                    </button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to={"/analyze"}>
                <button className="mt-1 w-full text-left px-3 py-2 rounded-md text-base font-medium bg-blue-100 text-blue-700">
                    Summarize
                </button>
              </Link>
              <Link to={"/videos"}>
                <button className="mt-1 w-full text-left px-3 py-2 rounded-md text-base font-medium bg-blue-100 text-blue-700">
                    Videos
                </button>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user.username ? (
              <div className="px-2 space-y-1">
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Log in
                </button>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;