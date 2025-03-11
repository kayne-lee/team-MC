import React, { useState, useEffect } from 'react';
import './Navbar.css';
import nucleus from './assets/nucleus.png';
import { useNavigate } from 'react-router-dom';
import profile from './assets/profile.png';
import SettingsPopup from '../components/SettingsPopUp';
import { FaUser, FaEnvelope, FaCog, FaSignOutAlt, FaCalendar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cal from './assets/Calendar.png';

function Navbar({ activeTab, setActiveTab }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('')
  const [notifSettings, setNotifSettings] = useState({})
  const [allowNotifs, setAllowNotifs] = useState(true)
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_NUCLEUS_API;
  const [showPopup, setShowPopup] = useState(false);
    
  const togglePopup = () => setShowPopup(!showPopup);

    // Check for OAuth redirect code parameter
    useEffect(() => {
      console.log("Checking for OAuth redirect code");
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log("Code from URL:", code);
      
      if (code) {
        console.log("OAuth code found, attempting to close window");
        try {
          window.close();
        } catch (err) {
          console.error("Failed to close window:", err);
        }
      }
    }, []);
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

        const userData = await response.json();
        if (userData) {
          var notifState = {
            1: false,
            2: false,
            5: false,
          }
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          localStorage.setItem("name", userData.firstName + " " + userData.lastName);
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
          if (userData.notificationCount.length == 0) {
            setAllowNotifs(false)
          }
          setNotifSettings(notifState)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  const handleSettingsSave = (data) => {
    console.log(data)
    setShowPopup(false); // Close the popup
    if (data) {
      if(data.error == true) {
        toast.failure("Something Went Wront Updating Your Settings", {
          autoClose: 3000
        });
        return
      }
      var notifState = {
        1: false,
        2: false,
        5: false,
      }
      if (data.newNotif.includes(1)){
        notifState[1] = true
      }
      if (data.newNotif.includes(2)){
        notifState[2] = true
      }
      if (data.newNotif.includes(5)){
        notifState[5] = true
      }
      setNotifSettings(notifState)
      setAllowNotifs(data.allow);
      console.log("DONE")
      toast.success("Successfully Updated Your Settings!", {
        autoClose: 3000
      });
    }
    
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Top Bar */}
      <div className="h-[80px] w-full flex bg-white flex-row justify-between items-center">
        <div>
          <img src={nucleus} alt="Nucleus Logo" className="w-[141px] ml-[60px]" />
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
      {showPopup && <SettingsPopup data = {{"phone": phone, "email": email, "firstName": firstName, "lastName": lastName, "notifications": notifSettings, "allowNotifs": allowNotifs}}onClose={handleSettingsSave} />}
      </div>

      {/* Navigation */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="flex flex-row gap-10 px-[60px] py-4">
          <button 
            className={`nav-item flex flex-row items-center gap-[6px] ${activeTab === 'List' ? 'text-[#8338EC]' : 'text-gray-600'}`}
            onClick={() => setActiveTab('List')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17.75 3C18.612 3 19.4386 3.34241 20.0481 3.9519C20.6576 4.5614 21 5.38805 21 6.25V17.75C21 18.612 20.6576 19.4386 20.0481 20.0481C19.4386 20.6576 18.612 21 17.75 21H6.25C5.38805 21 4.5614 20.6576 3.9519 20.0481C3.34241 19.4386 3 18.612 3 17.75V6.25C3 5.38805 3.34241 4.5614 3.9519 3.9519C4.5614 3.34241 5.38805 3 6.25 3H17.75ZM17.75 4.5H6.25C5.78587 4.5 5.34075 4.68437 5.01256 5.01256C4.68437 5.34075 4.5 5.78587 4.5 6.25V17.75C4.5 18.716 5.284 19.5 6.25 19.5H17.75C18.2141 19.5 18.6592 19.3156 18.9874 18.9874C19.3156 18.6592 19.5 18.2141 19.5 17.75V6.25C19.5 5.78587 19.3156 5.34075 18.9874 5.01256C18.6592 4.68437 18.2141 4.5 17.75 4.5ZM13.25 8C13.4489 8 13.6397 8.07902 13.7803 8.21967C13.921 8.36032 14 8.55109 14 8.75V11.5H15.5V8.75C15.5 8.55109 15.579 8.36032 15.7197 8.21967C15.8603 8.07902 16.0511 8 16.25 8C16.4489 8 16.6397 8.07902 16.7803 8.21967C16.921 8.36032 17 8.55109 17 8.75V15.22C17 15.4189 16.921 15.6097 16.7803 15.7503C16.6397 15.891 16.4489 15.97 16.25 15.97C16.0511 15.97 15.8603 15.891 15.7197 15.7503C15.579 15.6097 15.5 15.4189 15.5 15.22V13H13.25C13.0511 13 12.8603 12.921 12.7197 12.7803C12.579 12.6397 12.5 12.4489 12.5 12.25V8.75C12.5 8.55109 12.579 8.36032 12.7197 8.21967C12.8603 8.07902 13.0511 8 13.25 8ZM7.5 8.744C7.847 8.362 8.415 8 9.25 8C10.402 8 11.144 8.792 11.405 9.661C11.658 10.508 11.505 11.556 10.785 12.279C10.5355 12.5193 10.2706 12.7431 9.992 12.949L9.952 12.98C9.672 13.196 9.422 13.392 9.202 13.61C8.947 13.866 8.738 14.145 8.617 14.5H10.75C10.9489 14.5 11.1397 14.579 11.2803 14.7197C11.421 14.8603 11.5 15.0511 11.5 15.25C11.5 15.4489 11.421 15.6397 11.2803 15.7803C11.1397 15.921 10.9489 16 10.75 16H7.75C7.55109 16 7.36032 15.921 7.21967 15.7803C7.07902 15.6397 7 15.4489 7 15.25C7 14.003 7.524 13.167 8.144 12.549C8.44 12.253 8.762 12.004 9.034 11.793L9.037 11.791C9.323 11.57 9.545 11.398 9.722 11.221C9.994 10.947 10.089 10.496 9.968 10.091C9.853 9.71 9.598 9.5 9.25 9.5C8.897 9.5 8.715 9.637 8.61 9.753C8.54828 9.82038 8.49856 9.89783 8.463 9.982L8.461 9.985C8.39825 10.1724 8.26408 10.3274 8.08766 10.4164C7.91123 10.5054 7.70681 10.5212 7.51881 10.4604C7.33081 10.3995 7.17443 10.2669 7.08365 10.0914C6.99287 9.91586 6.97503 9.7116 7.034 9.523L7.069 9.427C7.17096 9.17577 7.31753 8.94454 7.5 8.744Z" fill="currentColor"/>
            </svg>
            <span>List</span>
          </button>
          
          <button 
            className={`nav-item flex flex-row items-center gap-[6px] ${activeTab === 'Tasks' ? 'text-[#8338EC]' : 'text-gray-600'}`}
            onClick={() => setActiveTab('Tasks')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21.75 24H2.25C1.005 24 0 22.995 0 21.75V3.75C0 2.505 1.005 1.5 2.25 1.5H21.75C22.995 1.5 24 2.505 24 3.75V21.75C24 22.995 22.995 24 21.75 24ZM2.25 3C1.83 3 1.5 3.33 1.5 3.75V21.75C1.5 22.17 1.83 22.5 2.25 22.5H21.75C22.17 22.5 22.5 22.17 22.5 21.75V3.75C22.5 3.33 22.17 3 21.75 3H2.25Z" fill="currentColor"/>
              <path d="M6.75 6C6.33 6 6 5.67 6 5.25V0.75C6 0.33 6.33 0 6.75 0C7.17 0 7.5 0.33 7.5 0.75V5.25C7.5 5.67 7.17 6 6.75 6ZM17.25 6C16.83 6 16.5 5.67 16.5 5.25V0.75C16.5 0.33 16.83 0 17.25 0C17.67 0 18 0.33 18 0.75V5.25C18 5.67 17.67 6 17.25 6ZM23.25 9H0.75C0.33 9 0 8.67 0 8.25C0 7.83 0.33 7.5 0.75 7.5H23.25C23.67 7.5 24 7.83 24 8.25C24 8.67 23.67 9 23.25 9Z" fill="currentColor"/>
              <path d="M6 15C6.82843 15 7.5 14.3284 7.5 13.5C7.5 12.6716 6.82843 12 6 12C5.17157 12 4.5 12.6716 4.5 13.5C4.5 14.3284 5.17157 15 6 15Z" fill="currentColor"/>
              <path d="M12 15C12.8284 15 13.5 14.3284 13.5 13.5C13.5 12.6716 12.8284 12 12 12C11.1716 12 10.5 12.6716 10.5 13.5C10.5 14.3284 11.1716 15 12 15Z" fill="currentColor"/>
              <path d="M18 15C18.8284 15 19.5 14.3284 19.5 13.5C19.5 12.6716 18.8284 12 18 12C17.1716 12 16.5 12.6716 16.5 13.5C16.5 14.3284 17.1716 15 18 15Z" fill="currentColor"/>
              <path d="M6 19.5C6.82843 19.5 7.5 18.8284 7.5 18C7.5 17.1716 6.82843 16.5 6 16.5C5.17157 16.5 4.5 17.1716 4.5 18C4.5 18.8284 5.17157 19.5 6 19.5Z" fill="currentColor"/>
              <path d="M12 19.5C12.8284 19.5 13.5 18.8284 13.5 18C13.5 17.1716 12.8284 16.5 12 16.5C11.1716 16.5 10.5 17.1716 10.5 18C10.5 18.8284 11.1716 19.5 12 19.5Z" fill="currentColor"/>
              <path d="M18 19.5C18.8284 19.5 19.5 18.8284 19.5 18C19.5 17.1716 18.8284 16.5 18 16.5C17.1716 16.5 16.5 17.1716 16.5 18C16.5 18.8284 17.1716 19.5 18 19.5Z" fill="currentColor"/>
            </svg>
            <span>Week</span>
          </button>
          
          <button 
            className={`nav-item flex flex-row items-center gap-[6px] ${activeTab === 'Classes' ? 'text-[#8338EC]' : 'text-gray-600'}`}
            onClick={() => setActiveTab('Classes')}
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21.75 24H2.25C1.005 24 0 22.995 0 21.75V3.75C0 2.505 1.005 1.5 2.25 1.5H21.75C22.995 1.5 24 2.505 24 3.75V21.75C24 22.995 22.995 24 21.75 24ZM2.25 3C1.83 3 1.5 3.33 1.5 3.75V21.75C1.5 22.17 1.83 22.5 2.25 22.5H21.75C22.17 22.5 22.5 22.17 22.5 21.75V3.75C22.5 3.33 22.17 3 21.75 3H2.25Z" fill="currentColor"/>
              <path d="M6.75 6C6.33 6 6 5.67 6 5.25V0.75C6 0.33 6.33 0 6.75 0C7.17 0 7.5 0.33 7.5 0.75V5.25C7.5 5.67 7.17 6 6.75 6ZM17.25 6C16.83 6 16.5 5.67 16.5 5.25V0.75C16.5 0.33 16.83 0 17.25 0C17.67 0 18 0.33 18 0.75V5.25C18 5.67 17.67 6 17.25 6ZM23.25 9H0.75C0.33 9 0 8.67 0 8.25C0 7.83 0.33 7.5 0.75 7.5H23.25C23.67 7.5 24 7.83 24 8.25C24 8.67 23.67 9 23.25 9ZM4.845 18H6.165L6.735 16.5H8.61L9.18 18H10.5L8.25 12H7.155L4.875 18H4.845ZM6.915 15.57L7.665 13.32L8.415 15.57H6.915ZM12.285 18C12.9 18 13.335 17.685 13.515 17.355H13.575V18H14.61V13.5H13.53V16.02C13.53 16.575 13.155 16.995 12.63 16.995C12.105 16.995 11.775 16.635 11.775 16.095V13.5H10.695V16.365C10.695 17.295 11.31 18 12.285 18ZM17.43 19.53C18.81 19.53 19.5 18.72 19.5 17.625V13.59H18.51V14.115H18.45C18.3109 13.9151 18.1243 13.7528 17.907 13.6429C17.6897 13.5329 17.4485 13.4787 17.205 13.485C16.125 13.485 15.33 14.325 15.33 15.6C15.33 16.875 16.14 17.7 17.235 17.7C17.955 17.7 18.345 17.265 18.45 17.085H18.51V17.61C18.51 18.3 18.15 18.69 17.43 18.69C16.875 18.69 16.56 18.465 16.485 18.09H15.555C15.63 18.84 16.26 19.515 17.43 19.515V19.53Z" fill="currentColor"/>
            </svg> */}
            <img src={Cal} alt="Calendar" className="w-[28px] h-[28px]" />
            <span>Classes</span>
          </button>
        </div>
        
      </div>
      <ToastContainer position="bottom-center"/>
    </div>
    
  );
}

export default Navbar;
