import '../styles/tasksPage.css';
import Navbar from '../navbar/Navbar';
import { useState, useEffect } from 'react';

const TasksPage = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [upcomingDays, setUpcomingDays] = useState([]);

    // Calculate the next 6 days
    useEffect(() => {
        const days = [];
        for (let i = 1; i <= 6; i++) {
            const nextDay = new Date(currentDate);
            nextDay.setDate(currentDate.getDate() + i);
            days.push(nextDay);
        }
        setUpcomingDays(days);
    }, [currentDate]);

    const handleExpand = (event) => {
        event.stopPropagation(); // Prevent event from propagating to the parent
        setIsExpanded(!isExpanded); // Toggle expansion state
    };

    const handleClose = () => {
        if (isExpanded) setIsExpanded(false); // Close only if expanded
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div
            className={`tasks-page parent min-h-screen ${isExpanded ? 'blur-background' : ''}`}
            onClick={handleClose} // Close when clicking outside the left box
        >
            {/* Page Header */}
            <h1 className="header">Upcoming Tasks</h1>

            {/* Layout Container */}
            <div className="layout-container">
                {/* Left Large Box */}
                <div
                    className={`left-box ${isExpanded ? 'expanded' : ''}`}
                    onClick={handleExpand} // Prevent collapse on clicking the box
                >
                    <h2 className="main-date-header">{formatDate(currentDate)}</h2>
                    <div className="task-list">
                        <h3 className="main-task-header">Today's Tasks</h3>
                        <ul className="main-list">
                            <li>Create Slideshow</li>
                            <li>Design Logos</li>
                            <li>Customer Research</li>
                        </ul>
                    </div>
                </div>

                {/* Right Grid of Boxes */}
                <div className="right-grid">
                    {upcomingDays.map((day, index) => (
                        <div className="grid-box" key={index}>
                            <h3 className="date-header">{formatDate(day)}</h3>
                            <h3 className="task-header">Tasks</h3>
                            <ul className="sub-list">
                                <li>Task {index + 1} - Example 1</li>
                                <li>Task {index + 1} - Example 2</li>
                                <li>Task {index + 1} - Example 3</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
