
import React, { useState } from "react";
import MongoService from '../services/MongoService';
const SettingsPopup = ({ data, onClose }) => {
 
    const mongoService = MongoService();
    const [activeTab, setActiveTab] = useState("Notifications");
    const [notificationsEnabled, setNotificationsEnabled] = useState(data["allowNotifs"]);
    const [fname, setFName] = useState(data["firstName"]);
    const [lname, setLName] = useState(data["lastName"])
    const [email, setEmail] = useState(data["email"]);
    const [phone, setPhone] = useState(data["phone"]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    // const [timePreferences, setTimePreferences] = useState(true);
    const [allowedNotifications, setAllowedNotifications] = useState({
      tasks: true,
      assignments: true,
      quizzes: true,
      events: true,
    });

    const [timePreferences, setTimePreferences] = useState(data["notifications"]);
    // Close the popup if the backdrop (outside the content) is clicked
    const handleCancel = (e) => {
        onClose();
    };

    const handleSave = async () => {
        var newNotif = []
        if (notificationsEnabled) {
        
          if (timePreferences[1] == true) {
              newNotif.push(1)
          } 
          if (timePreferences[2] == true) {
              newNotif.push(2)
          } 
          if (timePreferences[5] == true) {
              newNotif.push(5)
          } 
          console.log(newNotif)
        }
        try{
          await mongoService.updateNofitications(newNotif)
          onClose({"error":false,"newNotif":newNotif, "allow": notificationsEnabled});
          
        }
        catch{
      
          onClose({"error": true});
        }
      
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
              {[
                { name: "Account", icon: "👤" },
                // { name: "Security", icon: "🔒" },
                { name: "Notifications", icon: "🔔" },
              ].map((tab) => (
                <span
                  key={tab.name}
                  className={`flex-1 text-center cursor-pointer ${
                    activeTab === tab.name ? "font-semibold text-black border-b-2 border-purple-500" : ""
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <span className="mr-1">{tab.icon}</span> {tab.name}
                </span>
              ))}
            </div>
    
            {/* Tab Content */}
            <div className="mt-4">
            {activeTab === "Account" && (
                <div>
                <label className="block mb-2 w-full font-medium ">First Name</label>
                <input
                    type="text"
                    value={fname}
                    onChange={(e) => setFName(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4 mt-[-8px]"
                />

                <label className="block mb-2 w-full font-medium ">Last Name</label>
                <input
                    type="text"
                    value={lname}
                    onChange={(e) => setLName(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4 mt-[-8px]"
                />

                <label className="block mb-2 font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4 mt-[-8px]"
                />

                <label className="block mb-2 font-medium">Phone</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4 mt-[-8px]"
                />

                <button className="mt-4 flex items-center text-red-600">
                    🗑 Delete Account
                </button>
                </div>
                )}
              {activeTab === "Security" && <p>Security settings content goes here.</p>}
              {activeTab === "Notifications" && (
                <div>
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
    
                  {notificationsEnabled && (
                    <div className="ml-6 mt-3">
                      <p className="font-medium mb-1">Time Preferences</p>
                      <p className="text-sm text-gray-500">Receive Texts Certain Days Prior to Assessment</p>
                      {Object.entries(timePreferences).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2 ml-4">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => toggleTimes(key)}
                            className="w-4 h-4"
                          />
                          <span>{key}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
