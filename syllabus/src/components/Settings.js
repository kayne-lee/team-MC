import React, { useState } from "react";
import "../styles/settings.css";

const Settings = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <button className="close-btn" onClick={closeModal}>&times;</button>
        <h2>Settings</h2>
        <nav className="settings-nav">
          <button onClick={() => setActiveTab("account")} className={activeTab === "account" ? "active" : ""}>Account</button>
          <button onClick={() => setActiveTab("security")} className={activeTab === "security" ? "active" : ""}>Security</button>
          <button onClick={() => setActiveTab("notifications")} className={activeTab === "notifications" ? "active" : ""}>Notifications</button>
        </nav>

        {activeTab === "account" && (
          <div className="settings-section">
            <h3>Account Settings</h3>
            <label>Name: <input type="text" value="First Last" readOnly /></label>
            <label>Email: <input type="email" value="email@email.com" readOnly /></label>
            <label>Phone: <input type="tel" value="987-654-3210" readOnly /></label>
            <button className="delete">Delete Account</button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="settings-section">
            <h3>Security Settings</h3>
            <label>Password: <input type="password" value="********" readOnly /></label>
            <button>Reset</button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="settings-section">
            <h3>Notification Settings</h3>
            <label><input type="checkbox" checked /> Send Notifications by Text</label>
            <h4>Allow Notifications</h4>
            <label><input type="checkbox" checked /> Tasks</label>
            <label><input type="checkbox" checked /> Assignments</label>
            <label><input type="checkbox" checked /> Quizzes & Tests</label>
            <label><input type="checkbox" checked /> Events</label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
