
import React, { useState } from "react";
import MongoService from '../services/MongoService';

const SettingsPopup = ({ onClose }) => {
 
    const mongoService = MongoService();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    // const [timePreferences, setTimePreferences] = useState(true);
    const [allowedNotifications, setAllowedNotifications] = useState({
      tasks: true,
      assignments: true,
      quizzes: true,
      events: true,
    });

    const [timePreferences, setTimePreferences] = useState({
        1: true,
        2: false,
        5: true,
      });
    // Close the popup if the backdrop (outside the content) is clicked
    const handleCancel = (e) => {
        onClose();
    };

    const handleSave = async () => {
        onClose();
    };

    const toggleNotification = (type) => {
        setAllowedNotifications({
          ...allowedNotifications,
          [type]: !allowedNotifications[type],
        });
      };


    const toggleTimes = (type) => {
        setTimePreferences({
          ...timePreferences,
          [type]: !timePreferences[type],
        });
      };

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-[480px] p-6">
            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
    
            {/* Tabs */}
            <div className="flex border-b pb-2 text-gray-600">
              <span className="flex-1 text-center cursor-pointer">
                <span className="mr-1">👤</span> Account
              </span>
              <span className="flex-1 text-center cursor-pointer">
                <span className="mr-1">🔒</span> Security
              </span>
              <span className="flex-1 text-center font-semibold text-black border-b-2 border-purple-500 cursor-pointer">
                <span className="mr-1">🔔</span> Notifications
              </span>
            </div>
    
            {/* Notification Settings */}
            <div className="">
              <label className="flex items-center space-x-2 font-medium w-full">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="w-4 h-4"
                />
                <span>Send Notifications by Text</span>
              </label>
              <p className="text-sm text-gray-500 ml-6">Receive Messages via Phone Number</p>
              
              <div className="ml-6 mt-3" hidden = {!notificationsEnabled}>
                <p className="font-medium mb-1">Allow Notifications</p>
                {Object.entries(allowedNotifications).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2 ml-4">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleNotification(key)}
                      className="w-4 h-4"
                    />
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </label>
                ))}
              </div>
              
              <div className="ml-6 mt-3" hidden = {!notificationsEnabled}>
                <p className="font-medium mb-1">Time Preferences</p>
                <p className="text-sm text-gray-500 ">Receive Texts Certain Days Prior to Assessment</p>
                {Object.entries(timePreferences).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2 ml-4 ">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleTimes(key)}
                      className="w-full"
                    />
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </label>
                ))}
              </div>
    
              {/* <label className="flex items-center space-x-2 mt-4 font-medium w-full">
                <input
                  type="checkbox"
                  checked={timePreferences}
                  onChange={() => setTimePreferences(!timePreferences)}
                  className="w-4 h-4"
                />
                <span>Time Preferences</span>
              </label> */}
            </div>
    
            {/* Buttons */}
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      );
    };
export default SettingsPopup;
