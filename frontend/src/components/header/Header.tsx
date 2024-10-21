import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/authSlice';

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
    className="w-9 h-9 text-white cursor-pointer"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    />
  </svg>
);

// Simple Header Component
const Header: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Dispatch logout action to clear user state
    dispatch(setUser(null)); // Assuming setUser action can handle null to reset state
    // Navigate to Login
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-blue-500 text-white shadow-md">
      <div className="flex items-center">
        <div className="mr-2">
          {/* Placeholder for Icon; replace with actual icon if available */}
          <span role="img" aria-label="icon">📈</span> 
        </div>
        <h1 className="text-xl font-bold">BUDGETTT</h1>
      </div>
      <div className="relative">
        {/* <img
          src="https://via.placeholder.com/35" 
          alt="User Profile"
          className="w-9 h-9 rounded-full cursor-pointer"
          onClick={toggleDropdown}
        /> */}
        <div onClick={toggleDropdown}>
          <UserIcon />
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
            <button 
              className="w-full px-4 py-2 text-left text-black hover:bg-gray-200 focus:outline-none"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;