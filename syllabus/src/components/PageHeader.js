import React from 'react';
import plusIcon from '../assets/plus.png';
import lessthan from '../assets/lessthan.png';
import greaterthan from '../assets/greaterthan.png';
import '../styles/pageHeader.css';

const PageHeader = ({ currentDate, onDateChange, togglePopup }) => {
    const formatHeaderDate = (date) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${month} ${year}`;
    };

    const handleDateChange = (days) => {
       
        const newDate = new Date(currentDate);

        newDate.setDate(newDate.getDate() + days);

        localStorage.setItem('selectedDate', newDate.toISOString().split('T')[0]);
        onDateChange(newDate, true );
    };
    
    
    return (
        <div className="page-header">
            <div className="flex flex-row items-center justify-between gap-[10px]">
                <div className="flex flex-row items-center gap-[30px]">
                    <h1 className="header">{formatHeaderDate(currentDate)}</h1>

                    <div id="date-picker-wrapper" style={{ position: 'relative' }}>
                        <div className="popup-row flex items-center gap-2">
                            
                            <input
                                type="date"
                                className="popup-pill w-[127px]"
                                value={currentDate.toISOString().split('T')[0]}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    onDateChange(new Date(e.target.value), false);
                                }}                        
                            />
                            <button onClick={() => handleDateChange(-7)}>
                                <img src={lessthan} alt="Previous" className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDateChange(7)}>
                                <img src={greaterthan} alt="Next" className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Task Button */}
                <button
                    className="new-task-button mr-[40px]"
                    onClick={togglePopup}
                >
                    <div className="new-task-button">
                        <div className="new-task-button-inner">
                            <div className="frame-child" />
                        </div>
                        <div class="new-task">New Task</div>
                        {/* <img class="plus-icon" alt="" src={plusIcon}/> */}

                    </div>
                </button>
            </div>
        </div>
    );
};

export default PageHeader;
