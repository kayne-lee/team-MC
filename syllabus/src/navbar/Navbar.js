import React, { useState, useEffect } from 'react';
import './Navbar.css';
import nucleus from './assets/nucleus.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import profile from './assets/profile.png';
import SettingsPopup from '../components/SettingsPopUp';
import { FaUser, FaEnvelope, FaCog, FaSignOutAlt } from "react-icons/fa";

function Navbar({ activeTab, setActiveTab }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('')
  const [notifSettings, setNotifSettings] = useState({})
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_NUCLEUS_API;
  const [showPopup, setShowPopup] = useState(false);
    
  const togglePopup = () => setShowPopup(!showPopup);

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
        const response = await fetch(`${apiURL}/api/data/user`, requestOptions);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const userData = await response.json(); // Parse the JSON response
        if (userData) {
          var notifState = {
            1: false,
            2: false,
            5: false,
          }
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
          setPhone(userData.phone);
          console.log(userData)
          console.log(typeof(userData.notificationCount));
          if (userData.notificationCount.includes(1)){
            notifState[1] = true
          }
          if (userData.notificationCount.includes(2)){
            notifState[2] = true
          }
          if (userData.notificationCount.includes(5)){
            notifState[5] = true
          }
          setNotifSettings(notifState)
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

  const handleSettingsSave = (data) => {
       
    setShowPopup(false); // Close the popup
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
            <p className="m-0 p-[5px] flex items-center gap-2">
              <FaUser className="text-[#6A6A6A]" />
              <strong>{`${firstName} ${lastName}`}</strong>
            </p>
            <p className="m-0 p-[5px] text-[#6A6A6A] text-sm flex items-center gap-2">
              <FaEnvelope className="text-[#6A6A6A]" />
              {email}
            </p>
            <button
              className="bg-[#8338EC] text-white border-none py-[8px] px-[17px] cursor-pointer rounded-[25px] flex items-center gap-2 w-full mt-2"
              onClick={togglePopup}
            >
              <FaCog />
              Settings
            </button>
            <button
              className="bg-[#8338EC] text-white border-none py-[8px] px-[17px] cursor-pointer rounded-[25px] flex items-center gap-2 w-full mt-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
        )}
      </div>
      {showPopup && <SettingsPopup data = {{"phone": phone, "email": email, "firstName": firstName, "lastName": lastName, "notifications": notifSettings}}onClose={handleSettingsSave} />}
    </div>
  );
}

export default Navbar;
