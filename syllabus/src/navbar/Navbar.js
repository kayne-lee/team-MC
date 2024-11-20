import React, { useState } from 'react';
import './Navbar.css';
import nucleus from './assets/nucleus.png';
import profile from './assets/profile.png';

function Navbar() {
  const [activeTab, setActiveTab] = useState('SylaScan');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
      <img src={nucleus} alt="Logo" className="logo-icon"/> 
      </div>
      <ul className="nav-links">
        <li
          className={activeTab === 'Timeline' ? 'active' : ''}
          onClick={() => setActiveTab('Timeline')}
        >
          Timeline
        </li>
        <li
          className={activeTab === 'Tasks' ? 'active' : ''}
          onClick={() => setActiveTab('Tasks')}
        >
          Tasks
        </li>
        <li
          className={activeTab === 'SylaScan' ? 'active' : ''}
          onClick={() => setActiveTab('SylaScan')}
        >
          SylaScan
        </li>
      </ul>
      <div className="profile">
          <img src={profile} alt="Profile" className="profile-icon"
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        />
        {showProfileDropdown && (
          <div className="profile-dropdown">
            <p>Michael Curry</p>
            <button>Sign Out</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
