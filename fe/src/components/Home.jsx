import React, { useState, useEffect } from 'react';
import '../styles/home.css';

export default function Home() {
    const [selectedDay, setSelectedDay] = useState(1);
    const [weekOffset, setWeekOffset] = useState(0);
    const [buttonsToShow, setButtonsToShow] = useState(7); // Default to 7 buttons

    const handlePreviousWeek = () => {
        setWeekOffset(weekOffset - 1);
    };

    const handleNextWeek = () => {
        setWeekOffset(weekOffset + 1);
    };

    // Dynamically calculate how many buttons fit in the screen
    useEffect(() => {
        const updateButtonsToShow = () => {
            const containerWidth = window.innerWidth - 200; // Account for padding and arrows
            const buttonWidth = 90; // Approximate width of a button (81px width + margin/padding)
            const maxButtons = Math.floor(containerWidth / buttonWidth);
            setButtonsToShow(Math.max(3, maxButtons)); // Ensure at least 3 buttons are displayed
        };

        // Add event listener for resize
        window.addEventListener('resize', updateButtonsToShow);

        // Initial calculation
        updateButtonsToShow();

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', updateButtonsToShow);
        };
    }, []);

    // Generate the days to show based on weekOffset
    const days = Array.from({ length: buttonsToShow }, (_, i) => i + 1 + weekOffset * buttonsToShow);

    return (
        <div className="flex flex-col background min-h-screen">
            <div className="nav-placeholder h-36"></div>
            <div className="flex flex-row justify-between w-full flex-grow h-[300px] mb-8 pb-2">
                <div className="day-box">MONDAY</div>
                <div className="day-box">TUESDAY</div>
                <div className="day-box">WEDNESDAY</div>
                <div className="day-box">THURSDAY</div>
                <div className="day-box">FRIDAY</div>
            </div>
            <div className="flex flex-row justify-between w-full flex-grow mb-16 pb-32">
                <div className="day-box">SATURDAY</div>
                <div className="day-box">SUNDAY</div>
            </div>
            <div className="date-selector w-full h-[145px] flex items-center justify-center fixed bottom-0 mx-auto">
                <button onClick={handlePreviousWeek} className="arrow-button text-[100px] flex items-center justify-center">&lt;</button>
                <div className="select-buttons flex flex-row justify-center items-center w-full">
                    {days.map((day) => (
                        <button key={day} onClick={() => setSelectedDay(day)} className="flex items-center justify-center">
                            <div
                                className={`day-buttons cursor-pointer h-[81px] w-[81px] text-[24px] text-black font-bold rounded-[45px] flex justify-center items-center ${
                                    selectedDay === day ? 'bg-[#8338EC]' : 'bg-[#D9D9D9]'
                                }`}
                            >
                                {day}
                            </div>
                        </button>
                    ))}
                </div>
                <button onClick={handleNextWeek} className="arrow-button text-[100px] flex items-center justify-center">&gt;</button>
                <img src="/assets/icons/Calendar.png" alt="Calendar Icon" className="w-[81px] ml-[12px] mr-[34px] flex items-center justify-center" />
            </div>
        </div>
    );
}
