import React from 'react'
import '../styles/home.css'

export default function Home() {
    return (
        <div className="flex flex-row bg-white justify-between w-full">
            <div className="bg-gray-100 flex-1 text-center day-box">MONDAY</div>
            <div className="bg-gray-100 flex-1 text-center day-box">TUESDAY</div>
            <div className="bg-gray-100 flex-1 text-center day-box">WEDNESDAY</div>
            <div className="bg-gray-100 flex-1 text-center day-box">THURSDAY</div>
            <div className="bg-gray-100 flex-1 text-center day-box">FRIDAY</div>
            <div className="bg-gray-100 flex-1 text-center day-box">SATURDAY</div>
            <div className="bg-gray-100 flex-1 text-center day-box">SUNDAY</div>
        </div>
    );
}
