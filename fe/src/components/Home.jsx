import React from 'react'
import '../styles/home.css'

export default function Home() {
  return (
    <div className="task-page">
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-item">Timeline</div>
        <div className="nav-item active">Tasks</div>
        <div className="nav-item">SylaScan</div>
        <div className="profile-icon">👤</div>
      </div>

      {/* Task boxes for each day */}
      <div className="task-container">
        <div className="task-box">
          <h3>Saturday, October 26</h3>
          <ul>
            <li>QTMA Work
              <ul>
                <li>Create Slideshow</li>
                <li>Design Logos</li>
                <li>Customer Research</li>
              </ul>
            </li>
            <li>MATH 121: Calculus
              <ul>
                <li>Week 8 Videos</li>
                <li>Week 8 Webwork</li>
                <li>Start Week 8 Tutorial</li>
              </ul>
            </li>
          </ul>
        </div>
        
        {/* Other days (empty for now) */}
        <div className="task-box">
          <h3>Sunday, October 27</h3>
        </div>
        <div className="task-box">
          <h3>Monday, October 28</h3>
        </div>
        <div className="task-box">
          <h3>Tuesday, October 29</h3>
        </div>
        <div className="task-box">
          <h3>Wednesday, October 30</h3>
        </div>
      </div>

      {/* Date Selector */}
      <div className="date-selector">
        <button className="date-button">←</button>
        {[26, 27, 28, 29, 30, 31, 1].map((date) => (
          <button key={date} className="date-button">
            {date}
          </button>
        ))}
        <button className="date-button">→</button>
        <button className="calendar-icon">📅</button>
      </div>
    </div>
  );
}
