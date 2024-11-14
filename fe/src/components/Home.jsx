import React from 'react'
import '../styles/home.css'

export default function Home() {
    return (
        <div className="flex flex-col background min-h-screen">
            <div className="nav-placeholder h-36"></div>
            <div className="flex flex-row justify-between w-full flex-grow mb-16">
                <div className="day-box">MONDAY</div>
                <div className="day-box">TUESDAY</div>
                <div className="day-box">WEDNESDAY</div>
                <div className="day-box">THURSDAY</div>
                <div className="day-box">FRIDAY</div>
                <div className="day-box">SATURDAY</div>
                <div className="day-box">SUNDAY</div>
            </div>
            <div className="date-selector bg-gray-100 w-full h-52 flex items-center justify-center fixed bottom-0">
                Hello World
            </div>
        </div>
    );
}
