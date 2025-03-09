import '../styles/tasksPage.css';
import '../styles/tasksPopup.css';
import { useState, useEffect } from 'react';
import axios, { all } from 'axios';
import TaskPopup from './TaskPopUp';
import plusIcon from '../assets/plus.png';
import PageHeader from './PageHeader';
import sparkle from '../assets/sparkle.png'
import Loader from "./Loader";

const TasksPage = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState(() => {
        const savedDate = localStorage.getItem('selectedDate');
        return savedDate ? new Date(savedDate) : new Date();
    });
    const [upcomingDays, setUpcomingDays] = useState([]);
    const [assignmentsByDate, setAssignmentsByDate] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [randomTaskAdded, setRandomTaskAdded] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedAddDay, setSelectedAddDay] = useState();
    const togglePopup = () => setShowPopup(!showPopup);
    const apiURL = process.env.REACT_APP_NUCLEUS_API;
    const [forceRender, setForceRender] = useState(false);
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

    const handleDateClick = (day, shift) => {
        const selectedDate = new Date(day);
        selectedDate.setHours(0, 0, 0, 0);
        if (!shift) {
            selectedDate.setDate(selectedDate.getDate() + 1); 
        }
        
        setCurrentDate(selectedDate);
    };
    const forceReRender = () => {
        setForceRender(prev => !prev); // Toggle between true and false to trigger a re-render
    };
    // Fetch assignments and group them by due date
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Assume the token is stored in localStorage
                const token = localStorage.getItem('jwt');
                if (!token) throw new Error('No token found.');
                setIsLoaded(true);
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
                                title: task.description,
                                dueDate: formatDateKey(dueDate),
                                course: task.title,
                                isRandomTask: true,
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
                                    isRandomTask: false,
                                    completed: assignment.completed,
                                    progressionTasks: assignment.progressionTasks,
                                    description: assignment.description,
                                    grade: assignment.grade
                                };
                            })
                        )
                    );
                }
                var progressionTasks = []
                for (const course of response.data[0].courses){
                    for (const assignment of course["assignments"]) {
                        if (assignment["progressionTasks"]) {
            
                   
                            for (const data of assignment["progressionTasks"]) {
                               
                                const dueDate = new Date(data["dueDate"]);
                                const formatDate = formatDateKey(dueDate)
                                console.log("F",formatDate)
                                
                                progressionTasks.push({
                                    "course":data["course"],
                                    "dueDate":formatDate,
                                    "title":data["title"],
                                    "description": data["description"],
                                    "isProgression": true,
                                    "hidden":true
                                });
                                
                            }
                        }
                    }
                }
            
                 allAssignments = [ ...randomTasks, ...allAssignments, ...progressionTasks ];
               
                const groupedAssignments = allAssignments.reduce((acc, assignment) => {
                    if (!acc[assignment.dueDate]) acc[assignment.dueDate] = [];
                    acc[assignment.dueDate].push(assignment);
                    return acc;
                }, {});
                console.log("GROUPED ASSIGNMENTS!:", groupedAssignments)
                setAssignmentsByDate(groupedAssignments);
                setIsLoaded(false);
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
                    "course":data["title"],
                    "dueDate":date,
                    "title":data["description"],
                    "weight":"",
                    "isRandomTask": true
                })
            } else{
                tempAssignments[date] = [{
                    "course":data["title"],
                    "dueDate":date,
                    "title":data["description"],
                    "weight":"",
                    "isRandomTask": true
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

    const showProgression = (assignment) => {
        console.log(assignment)
        var tempAssignments = assignmentsByDate;
        for (const [key, value] of Object.entries(tempAssignments)) {
        
            for(var task of value) {
               
                if(task["isProgression"]) {
                    console.log(task)
                    if(task["course"] == assignment["course"]) {
                        task["hidden"] = false
                    }
                }
            }
          }
        
        setAssignmentsByDate(tempAssignments);
        forceReRender();
          
      
    }

    const formatDisplayDate = (date) => {
        // Create short day names
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Get day name and date
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate();
        
        // Return formatted string
        return `${dayName} ${dayNumber}`;
    };

    return (
        <div
            className={`parent ${isExpanded ? 'blur-background' : ''}`}
            onClick={(e) => {
                if (!e.target.closest('#date-picker')) handleClose();
            }}
        >
                        {isLoaded ? (
                            <Loader />
                        ) : (
                            <>
                            <PageHeader 
                currentDate={currentDate}
                onDateChange={handleDateClick}
                togglePopup={togglePopup}
                isExpanded={isExpanded}
                handleClose={handleClose}
            />
            
            {/* Layout Container */}
            <div className="layout-container">

                {/* Right Grid of Boxes (Next 6 Days) */}
                <div className="right-grid overflow-y-auto no-scrollbar">
                    {upcomingDays.map((day, index) => (
                        <div
                            className="grid-box"
                            key={index}
                            onClick={() => {
                                setShowPopup(true);
                                setSelectedAddDay(day);
                            }}
                        >
                            <div className="flex justify-center items-center flex-col mb-[10px]">
                                <div className="date-header">
                                    {formatDisplayDate(day)}
                                </div>
                            </div>
                            <div className="sub-list flex flex-col gap-[15px]">
                                
                                {(assignmentsByDate[formatDateKey(day)] || []).filter(assignment => !(assignment.isProgression && assignment.hidden)).map((assignment, idx) => (
                                    
                                    <div
                                        key={idx}
                                        className={`task-tile ${
                                            assignment.isProgression
                                                ? 'bg-[#bda5ea] text-white'
                                                : assignment.isRandomTask
                                                ? 'bg-[#FAFAFA] text-black'
                                                : 'bg-[#8338EC] text-white'
                                        }`}
                                        onClick={(e) => e.stopPropagation()} // Prevent popup from opening when clicking on tasks
                                    >
                                        <div className="task-content">
                                            <div className={``}>
                                                <div
                                                    className={`task-details ${
                                                        assignment.isRandomTask
                                                            ? 'border-b border-black'
                                                            : 'border-b border-white/30'
                                                    }`}
                                                >
                                                    <span>{assignment.course}</span>
                                                </div>
                                                <div className="task-details mt-[4px]">
                                                    {assignment.title}
                                                </div>
                                            </div>
                                            {assignment.weight && (
                                                <div className="weight-container">
                                                    <span className="weight-badge">
                                                        {assignment.weight}
                                                        
                                                    </span>
                                                    <img src={sparkle} alt="sparkle" width="23" height="10" className="ml-2 cursor-pointer" onClick={() => showProgression(assignment)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && <TaskPopup onSave={handleSave} data={{"date": selectedAddDay ? selectedAddDay : null}}/>}
                            </>)}
            

        </div>
    );
};

export default TasksPage;
