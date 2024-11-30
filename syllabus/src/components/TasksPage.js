import '../styles/tasksPage.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskPopup from './TaskPopUp';
import plusIcon from '../assets/plus.png';

const TasksPage = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [upcomingDays, setUpcomingDays] = useState([]);
    const [assignmentsByDate, setAssignmentsByDate] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => setShowPopup(!showPopup);

    // Format a date as YYYY-MM-DD (to match the API data)
    const formatDateKey = (date) => date.toISOString().split('T')[0];

    // Calculate the next 6 days, including today
    useEffect(() => {
        const days = [];
        for (let i = 0; i <= 6; i++) {
            // Create a new Date object based on currentDate
            const nextDay = new Date(currentDate);
            
            // Set the time to midnight to avoid timezone issues
            nextDay.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
            
            // Add i days to currentDate
            nextDay.setDate(currentDate.getDate() + i);
            
            // Push the formatted date to the days array
            days.push(nextDay);
        }
        setUpcomingDays(days);
    }, [currentDate]);

    const handleDateClick = (day) => {
        const selectedDate = new Date(day);
        selectedDate.setHours(0, 0, 0, 0);
        selectedDate.setDate(selectedDate.getDate() + 1); 
        setCurrentDate(selectedDate);
      };

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
            onClick={(e) => {
                if (!e.target.closest('#date-picker')) handleClose();
            }}
        >
            {/* Page Header */}
            <div className="flex flex-row items-center gap-[10px]">
                <h1 className="header">Upcoming Tasks</h1>

                <div id="date-picker-wrapper" style={{ position: 'relative' }}>
                    <div className={`calendar-icon-container ${isExpanded ? 'blur-background' : ''}`}>
                        <label htmlFor="date-picker" tabIndex="0"></label>
                    </div>
                    <input
                        type="date"
                        className="form-control"
                        id="date-picker"
                        value={currentDate.toISOString().split('T')[0]}
                        onClick={(e) => e.stopPropagation()} // Prevent the date input click from propagating
                        onChange={(e) => {
                            e.stopPropagation(); // Ensure change event doesn’t propagate
                            handleDateClick(e.target.value); // Handle the date change
                        }}
                    />
                </div>

                {/* Add Task Button */}
                <button
                className="new-task-button"
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
                <div className="right-grid overflow-y-auto  no-scrollbar">
                    {upcomingDays.slice(1).map((day, index) => (
                        <div className="grid-box" key={index}>
                            <div className="flex justify-center items-center flex-col mb-[10px]">
                                <h3 className="date-header mb-[7px]">{formatDisplayDate(day)}</h3>
                                <div className="w-[320px] h-[1px] bg-black"></div>
                            </div>
                            <ul className="sub-list">
                                {(assignmentsByDate[formatDateKey(day)] || []).map((assignment, idx) => (
                                    <li key={idx} className="flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:mr-3 before:bg-black before:rounded-full">
                                        <strong>{assignment.title}</strong> - {assignment.course} ({assignment.weight})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && <TaskPopup onSave={() => setShowPopup(false)} />}

        </div>
    );
};

export default TasksPage;
