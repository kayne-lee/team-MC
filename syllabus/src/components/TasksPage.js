import '../styles/tasksPage.css';
import '../styles/tasksPopup.css';
import { useState, useEffect } from 'react';
import axios, { all } from 'axios';
import TaskPopup from './TaskPopUp';
import plusIcon from '../assets/plus.png';

const TasksPage = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [upcomingDays, setUpcomingDays] = useState([]);
    const [assignmentsByDate, setAssignmentsByDate] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [randomTaskAdded, setRandomTaskAdded] = useState({});
    const togglePopup = () => setShowPopup(!showPopup);
    const apiURL = process.env.REACT_APP_NUCLEUS_API;

    // Format a date as YYYY-MM-DD (to match the API data)
    // const formatDateKey = (date) => date.toISOString().split('T')[0];
    const formatDateKey = (date) => {
        const year = date.getFullYear(); // Local year
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Local month (0-indexed)
        const day = String(date.getDate()).padStart(2, '0'); // Local day
        return `${year}-${month}-${day}`; // Combine into YYYY-MM-DD format
      };

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

                const response = await axios.get(`${apiURL}/api/data/courses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("RES",response.data[0])
                var randomTasks = []
                var allAssignments = []
                if (response.data[0].randomTasks) {
                
                    var randomTasks = response.data.flatMap((userTask =>
                        userTask.randomTasks.flatMap((task) => {
                      
                            const dueDate = new Date(task.dueDate);
                           
                            // Adjust the date if it's off by a timezone or other issue
                            // dueDate.setDate(dueDate.getDate() - 1); // Subtract 1 day
    
                            return {
                                title: task.title,
                                description: task.description,
                                dueDate: formatDateKey(dueDate),
                                course:"Extra Task"
                            };
                            
                        })
                    ));
                }
         
                // Flatten assignments and group by due date
                if (response.data[0].courses != null) {
                    
                    var allAssignments = response.data.flatMap((userCourse) =>
                        userCourse.courses.flatMap((course) =>
                            course.assignments.map((assignment) => {
                                const dueDate = new Date(assignment.dueDate);
        
                                // Adjust the date if it's off by a timezone or other issue
                                // dueDate.setDate(dueDate.getDate() - 1); // Subtract 1 day
        
                                return {
                                    title: assignment.title,
                                    course: course.title,
                                    weight: assignment.weight,
                                    dueDate: formatDateKey(dueDate),
                                };
                            })
                        )
                    );
                }
            
                 allAssignments = [ ...randomTasks, ...allAssignments ];
               
                const groupedAssignments = allAssignments.reduce((acc, assignment) => {
                    if (!acc[assignment.dueDate]) acc[assignment.dueDate] = [];
                    acc[assignment.dueDate].push(assignment);
                    return acc;
                }, {});
                console.log("GROUPED ASSIGNMENTS!:", groupedAssignments)
                setAssignmentsByDate(groupedAssignments);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };
        if (Object.keys(assignmentsByDate).length == 0){
            fetchAssignments();
        }
      
    }, []);

    const handleSave = (data) => {
       
        if (data["dueDate"]) {
            const date = data["dueDate"].split("T")[0];
            var tempAssignments = assignmentsByDate;
            
            if (date in tempAssignments){
                tempAssignments[date].push({
                    "course":"Extra Task",
                    "dueDate":date,
                    "title":data["title"],
                    "weight":""
                })
            } else{
                tempAssignments[date] = [{
                    "course":"Extra Task",
                    "dueDate":date,
                    "title":data["title"],
                    "weight":""
                }]
            }

                
         
            setRandomTaskAdded(data); // Update the state with the data from the popup
            setAssignmentsByDate(tempAssignments);
 
        }
        setShowPopup(false); // Close the popup
    };

    const handleExpand = (event) => {
        event.stopPropagation(); // Prevent event from propagating to the parent
        setIsExpanded(!isExpanded); // Toggle expansion state
    };

    const handleClose = () => {
        if (isExpanded) setIsExpanded(false); // Close only if expanded
    };

    const formatDisplayDate = (date) => {
        // Create short day names
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Get day name and date
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate();
        
        // Return formatted string
        return `${dayName} ${dayNumber}`;
    };

    const formatHeaderDate = (date) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${month} ${year}`;
    };

    return (
        <div
            className={`parent ${isExpanded ? 'blur-background' : ''}`}
            onClick={(e) => {
                if (!e.target.closest('#date-picker')) handleClose();
            }}
        >
            {/* Page Header */}
            <div className="flex flex-row items-center justify-between gap-[10px] ">
                <div className="flex flex-row items-center gap-[30px]">
                    <h1 className="header">{formatHeaderDate(currentDate)}</h1>

                    <div id="date-picker-wrapper" style={{ position: 'relative' }}>
                        <div className="popup-row">
                            <input
                                type="date"
                                className="popup-pill w-[100px]"
                                value={currentDate.toISOString().split('T')[0]}
                                onClick={(e) => e.stopPropagation()} // Update date state
                                onChange={(e) => {
                                    e.stopPropagation(); // Ensure change event doesn't propagate
                                    handleDateClick(e.target.value); // Handle the date change
                                }}                        
                            />
                        </div>
                    </div>
                </div>


                {/* Add Task Button */}
                    <button
                        className="new-task-button mr-[60px]"
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

                {/* Right Grid of Boxes (Next 6 Days) */}
                <div className="right-grid overflow-y-auto  no-scrollbar">
                    {upcomingDays.map((day, index) => (
                        <div className="grid-box" key={index}>
                            <div className="flex justify-center items-center flex-col mb-[10px]">
                                <div className="date-header">
                                    {formatDisplayDate(day)}
                                </div>
                                <div className="w-[320px] h-[1px] bg-black"></div>
                            </div>
                            <div className="sub-list flex flex-col gap-[15px]">
                                {(assignmentsByDate[formatDateKey(day)] || []).map((assignment, idx) => (
                                    <div key={idx} className="task-tile">
                                        <div className="task-content">
                                            {assignment.course === "Extra Task" ? (
                                                <strong>{assignment.title}</strong>
                                            ) : (
                                                <>
                                                    <strong>{assignment.title}</strong>
                                                    <div className="task-details">
                                                        {assignment.course} {assignment.weight && `(${assignment.weight})`}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && <TaskPopup onSave={handleSave} />}

        </div>
    );
};

export default TasksPage;
