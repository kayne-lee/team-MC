import '../styles/tasksPage.css';
import Navbar from '../navbar/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

const TasksPage = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [upcomingDays, setUpcomingDays] = useState([]);
    const [assignmentsByDate, setAssignmentsByDate] = useState({});

    // Format a date as YYYY-MM-DD (to match the API data)
    const formatDateKey = (date) => date.toISOString().split('T')[0];

    // Calculate the next 6 days, including today
    useEffect(() => {
        const days = [];
        for (let i = 0; i <= 6; i++) {
            const nextDay = new Date(currentDate);
            nextDay.setDate(currentDate.getDate() + i);
            days.push(nextDay);
        }
        setUpcomingDays(days);
    }, [currentDate]);

    // Fetch assignments and group them by due date
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Assume the token is stored in localStorage
                const token = localStorage.getItem('jwt');
                if (!token) throw new Error('No token found.');

                const response = await axios.get('http://localhost:8080/api/data/courses', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Flatten assignments and group by due date
                const allAssignments = response.data.flatMap((userCourse) =>
                    userCourse.courses.flatMap((course) =>
                        course.assignments.map((assignment) => ({
                            title: assignment.title,
                            course: course.title,
                            weight: assignment.weight,
                            dueDate: formatDateKey(new Date(assignment.dueDate)),
                        }))
                    )
                );

                const groupedAssignments = allAssignments.reduce((acc, assignment) => {
                    if (!acc[assignment.dueDate]) acc[assignment.dueDate] = [];
                    acc[assignment.dueDate].push(assignment);
                    return acc;
                }, {});

                setAssignmentsByDate(groupedAssignments);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        fetchAssignments();
    }, []);

    const handleExpand = (event) => {
        event.stopPropagation(); // Prevent event from propagating to the parent
        setIsExpanded(!isExpanded); // Toggle expansion state
    };

    const handleClose = () => {
        if (isExpanded) setIsExpanded(false); // Close only if expanded
    };

    const formatDisplayDate = (date) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div
            className={`parent min-h-screen ${isExpanded ? 'blur-background' : ''}`}
            onClick={handleClose} // Close when clicking outside the left box
        >
            {/* Page Header */}
            <h1 className="header">Upcoming Tasks</h1>
            {/* Layout Container */}
            <div className="layout-container">
                {/* Left Large Box (Today's Tasks) */}
                <div
                    className={`left-box ${isExpanded ? 'expanded' : ''}`}
                    onClick={handleExpand} // Prevent collapse on clicking the box
                >
                    <div class="text-white font-poppins text-[26px] font-extrabold leading-normal">{formatDisplayDate(currentDate)}</div>
                    <div className="task-list">
                        <ul className="main-list list-none">
                            {(assignmentsByDate[formatDateKey(currentDate)] || []).map((assignment, index) => (
                                <li key={index} className="flex items-center before:content-[''] before:w-2.5 before:h-2.5 before:mr-3 before:bg-white before:rounded-full">
                                    <strong>{assignment.title}</strong> - {assignment.course} ({assignment.weight})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Grid of Boxes (Next 6 Days) */}
                <div className="right-grid overflow-y-auto overflow-x-hidden no-scrollbar">
                    {upcomingDays.slice(1).map((day, index) => (
                        <div className="grid-box" key={index}>
                            <div className="flex justify-center items-center flex-col">
                                <h3 className="date-header">{formatDisplayDate(day)}</h3>
                                <div className="w-[280px] h-[1px] bg-black"></div>
                            </div>
                            <ul className="sub-list">
                                {(assignmentsByDate[formatDateKey(day)] || []).map((assignment, idx) => (
                                    <li key={idx}>
                                        <strong>{assignment.title}</strong> - {assignment.course} ({assignment.weight})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
