import React from 'react';
import '../styles/listView.css';
import { useState } from 'react';
import TaskPopup from './TaskPopUp';
import plusIcon from '../assets/plus.png';

const ListView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => setShowPopup(!showPopup);

    const formatHeaderDate = (date) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${month} ${year}`;
    };

    const handleDateClick = (day) => {
        const selectedDate = new Date(day);
        selectedDate.setHours(0, 0, 0, 0);
        selectedDate.setDate(selectedDate.getDate() + 1); 
        setCurrentDate(selectedDate);
    };



  return (
    
    <div className="list-view">

    {/* Page Header */}
        <div className="flex flex-row items-center justify-between gap-[10px] ">
            
            <div className="flex flex-row items-center gap-[30px]">
                <h1 className="header">{formatHeaderDate(currentDate)}</h1>

                <div id="date-picker-wrapper" style={{ position: 'relative' }}>
                    <div className="popup-row">
                        <input
                            type="date"
                            className="popup-pill w-[100px]"
                            value={currentDate.toISOString().split('T')[0]}
                            onClick={(e) => e.stopPropagation()} // Update date state
                            onChange={(e) => {
                                e.stopPropagation(); // Ensure change event doesn't propagate
                                handleDateClick(e.target.value); // Handle the date change
                            }}                        
                        />
                    </div>
                </div>
            </div>

            {/* Add Task Button */}
                <button
                    className="new-task-button mr-[60px]"
                    onClick={togglePopup}
                >
                    <div class="new-task-button">
                        <div class="new-task-button-inner">
                            <div class="frame-child">
                            </div>
                        </div>
                        <div class="new-task">New Task</div>
                        <img class="plus-icon" alt="" src={plusIcon}/>
                    </div>
                </button>
            </div>

      <div className="list-container">
        <div className="date-section">
          <h2>Mon 20</h2>
          <div className="tasks">
            <div className="task-item">
              <div className="task-left">
                <input type="checkbox" className="checkbox" />
                <span>Assignment 1</span>
              </div>
              <div className="task-right">
                <span className="time">11:59 PM</span>
                <div className="class-tag">CISC 121</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;