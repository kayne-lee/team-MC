import React, { useState, useEffect } from 'react';
import './Navbar.css';
import nucleus from './assets/nucleus.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import profile from './assets/profile.png';

function Navbar({ activeTab, setActiveTab }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      try {
        const response = await fetch("https://api.nucleusapp.ca:8443/api/data/user", requestOptions);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const userData = await response.json(); // Parse the JSON response
        if (userData) {
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <div className="h-[114px] w-full flex flex-row justify-between items-center">
      {/* Logo */}
      <div>
        <img src={nucleus} alt="Nucleus Logo" className="w-[141px] ml-[60px]" />
      </div>

      {/* Tabs Container */}
      <div className="w-[316px] h-[50px] rounded-[33px] bg-[#FDFBFD] flex flex-row justify-around items-center relative mr-[60px]">
        <motion.div
          className="absolute bottom-0 left-0 h-full bg-purple-600 rounded-[33px] z-0"
          style={{
            width: '169px',
          }}
          animate={{
            left: activeTab === 'Classes' ? '0' : activeTab === 'Tasks' ? '160.33px' : '265px',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration: 0.3,
          }}
        />
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
      </div>

      {/* Profile Dropdown */}
      <div className="mr-[60px] relative">
        <img
          src={profile}
          alt="Profile"
          className="w-[40px] h-[40px] cursor-pointer"
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        />
        {showProfileDropdown && (
          <div className="absolute right-0 top-[60px] z-10 bg-white border border-[#ccc] rounded-[5px] shadow-[0_2px_5px_rgba(0,_0,_0,_0.1)] p-[10px]">
            <p className="m-0 p-[10px_5px]">
              <strong>{`${firstName} ${lastName}`}</strong>
            </p>
            <p className="m-0 p-[10px_5px] text-[#6A6A6A] text-sm">{email}</p>
            <button
              className="bg-[#8338EC] text-white border-none py-[12px] px-[17px] cursor-pointer rounded-[25px]"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
