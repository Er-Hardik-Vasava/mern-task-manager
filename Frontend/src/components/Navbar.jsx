import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/user/logout",
        { withCredentials: true }
      );
      toast.success(data.message);
      setIsAuthenticated(false);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Logout failed!";
      toast.error(errorMessage);
    }
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {isAuthenticated && (
        <div className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-xl font-bold">Task Manager</div>
            <div className="hidden md:flex md:items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white">
                Home
              </Link>
              <Link to="/task" className="text-gray-300 hover:text-white">
                Your Task
              </Link>
              <Link onClick={handleLogout} className="text-gray-300 hover:text-white">
                Logout
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white" onClick={toggleMobileMenu}>
                {/* Hamburger icon */}
                &#9776;
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <ul className="flex flex-col space-y-2 mt-2">
                <li>
                  <Link to="/" className="block text-gray-300 hover:text-white" onClick={toggleMobileMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/task" className="block text-gray-300 hover:text-white" onClick={toggleMobileMenu}>
                    Your Task
                  </Link>
                </li>
                <li>
                  <Link onClick={(e) => { handleLogout(e); toggleMobileMenu(); }} className="block text-gray-300 hover:text-white">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
