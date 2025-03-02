import React from 'react';
import plusIcon from '../assets/plus.png';
import '../styles/pageHeader.css';

const PageHeader = ({ currentDate, onDateChange, togglePopup, isExpanded, handleClose }) => {
    const formatHeaderDate = (date) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${month} ${year}`;
    };

    const handleDateChange = (value) => {
        localStorage.setItem('selectedDate', value);
        onDateChange(value);
    };

    return (
        <div className="page-header">
            <div className="flex flex-row items-center justify-between gap-[10px]">
                <div className="flex flex-row items-center gap-[30px]">
                    <h1 className="header">{formatHeaderDate(currentDate)}</h1>

                    <div id="date-picker-wrapper" style={{ position: 'relative' }}>
                        <div className="popup-row">
                            <input
                                type="date"
                                className="popup-pill w-[120px]"
                                value={currentDate.toISOString().split('T')[0]}
                                onClick={(e) => e.stopPropagation()} // Update date state
                                onChange={(e) => {
                                    e.stopPropagation(); // Ensure change event doesn't propagate
                                    handleDateChange(e.target.value); // Handle the date change
                                }}                        
                            />
                        </div>
                    </div>
                </div>

                {/* Add Task Button */}
                <button
                    className="new-task-button mr-[40px]"
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
        </div>
    );
};

export default PageHeader; 