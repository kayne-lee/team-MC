import React from 'react';
import '../styles/listView.css';
import { useState } from 'react';
import TaskPopup from './TaskPopUp';
import plusIcon from '../assets/plus.png';
import PageHeader from './PageHeader';

const ListView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => setShowPopup(!showPopup);

    const handleDateClick = (day) => {
        const selectedDate = new Date(day);
        selectedDate.setHours(0, 0, 0, 0);
        selectedDate.setDate(selectedDate.getDate() + 1); 
        setCurrentDate(selectedDate);
    };

    return (
        <div className="list-view">
            <PageHeader 
                currentDate={currentDate}
                onDateChange={handleDateClick}
                togglePopup={togglePopup}
            />
            
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