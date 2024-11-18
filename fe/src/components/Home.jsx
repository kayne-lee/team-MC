import React, { useState } from 'react';
import '../styles/home.css';

export default function Home() {
    const [selectedDay, setSelectedDay] = useState(1);
    const [weekOffset, setWeekOffset] = useState(0);

    const days = [1, 2, 3, 4, 5, 6, 7];

    const handlePreviousWeek = () => {
        setWeekOffset(weekOffset - 1);
    };

    const handleNextWeek = () => {
        setWeekOffset(weekOffset + 1);
    };

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
            <div className='flex flex-row justify-between w-full flex-grow mb-16 pb-32'>
                <div className="day-box">SATURDAY</div>
                <div className="day-box">SUNDAY</div>
            </div>
            <div className="date-selector w-full h-[145px] flex items-center justify-center fixed bottom-0 mx-auto">
                <button onClick={handlePreviousWeek} className="arrow-button text-[100px]">&lt;</button>
                <div className="select-buttons flex flex-row justify-between w-full">
                    {days.map(day => (
                        <button key={day} onClick={() => setSelectedDay(day + weekOffset * 7)}>
                            <div className={`cursor-pointer h-[81px] w-[81px] text-[24px] text-white rounded-[45px] mt-[38px] flex justify-center items-center ${selectedDay === day + weekOffset * 7 ? 'bg-[#8338EC]' : 'bg-gray-500'}`}>
                                {day + weekOffset * 7}
                            </div>
                        </button>
                    ))}
                </div>
                <button onClick={handleNextWeek} className="arrow-button text-[100px]">&gt;</button>
            </div>
        </div>
    );
}
