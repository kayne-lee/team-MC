import React, { useState } from 'react';
import './Navbar.css';
import nucleus from './assets/nucleus.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import profile from './assets/profile.png';

function Navbar({ activeTab, setActiveTab }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate()

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    // Remove the JWT token from localStorage (or sessionStorage)
    localStorage.removeItem('jwt'); // or sessionStorage.removeItem('jwtToken');

    // Navigate to the login page
    navigate("/login");
  };

  return (
    <div className="h-[114px] w-full flex flex-row justify-between items-center">
      {/* Logo */}
      <div>
        <img src={nucleus} alt="" className="w-[141px] ml-[60px]" />
      </div>

      {/* Tabs Container */}
      <div className="w-[408px] h-[50px] rounded-[33px] bg-[#FDFBFD] flex flex-row justify-around items-center relative mr-[60px]">
        {/* Sliding Purple Highlight */}
        <motion.div
          className="absolute bottom-0 left-0 h-full bg-purple-600 rounded-[33px] z-0"
          style={{
            width: '141px', // Highlight width
          }}
          animate={{
            left:
              activeTab === 'Classes'
                ? '0'
                : activeTab === 'Tasks'
                ? '130.33px'
                : '265px',
          }}
          transition={{
            type: 'spring',
            stiffness: 300, // Adjust the stiffness for smoothness
            damping: 25,     // Adjust the damping for smoothness
            duration: 0.3    // Explicit duration for the animation (in seconds)
          }}
        />

        {/* Tabs */}
        <div
          onClick={() => handleTabClick('Classes')}
          className={`text-[17.675px] font-bold font-poppins leading-normal cursor-pointer z-10 ${
            activeTab === 'Classes' ? 'text-white' : 'text-[#4A4A4A]'
          }`}
        >
          Classes
        </div>
        <div
          onClick={() => handleTabClick('Tasks')}
          className={`text-[17.675px] font-bold font-poppins leading-normal cursor-pointer z-10 ${
            activeTab === 'Tasks' ? 'text-white' : 'text-[#4A4A4A]'
          }`}
        >
          Tasks
        </div>
        <div
          onClick={() => handleTabClick('SylaScan')}
          className={`text-[17.675px] font-bold font-poppins leading-normal cursor-pointer z-10 ${
            activeTab === 'SylaScan' ? 'text-white' : 'text-[#4A4A4A]'
          }`}
        >
          SylaScan
        </div>
      </div>
      <div className="mr-[60px]">
        <img
          src={profile}
          alt="Profile"
          className="w-[40px] h-[40px] cursor-pointer"
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        />
        {showProfileDropdown && (
          <div className="absolute right-[60px] top-[75px] bg-white border border-[#ccc] rounded-[5px] shadow-[0_2px_5px_rgba(0,_0,_0,_0.1)] p-[10px]">
            <p className="m-0 p-[10px_5px]">Michael Curry</p>
            <button className="bg-[#8338EC] text-white border-none py-[12px] px-[17px] cursor-pointer rounded-[25px]" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
