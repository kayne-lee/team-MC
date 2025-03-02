import React from 'react';
import '../styles/listView.css';
import { useState, useEffect } from 'react';
import TaskPopup from './TaskPopUp';
import plusIcon from '../assets/plus.png';
import PageHeader from './PageHeader';
import axios from 'axios';

const ListView = () => {
    const [currentDate, setCurrentDate] = useState(() => {
        const savedDate = localStorage.getItem('selectedDate');
        return savedDate ? new Date(savedDate) : new Date();
    });
    const [showPopup, setShowPopup] = useState(false);
    const [tasksInMonth, setTasksInMonth] = useState([]);
    const [assignmentsByDate, setAssignmentsByDate] = useState({});
    const togglePopup = () => setShowPopup(!showPopup);
    const apiURL = process.env.REACT_APP_NUCLEUS_API;

    const formatDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getMonthYearKey = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return `${year}-${month}`;
    };

    const handleDateClick = (day) => {
        const selectedDate = new Date(day);
        selectedDate.setHours(0, 0, 0, 0);
        selectedDate.setDate(selectedDate.getDate() + 1); 
        setCurrentDate(selectedDate);
        localStorage.setItem('selectedDate', selectedDate.toISOString());
        filterTasksByMonth(selectedDate);
    };

    const filterTasksByMonth = (date) => {
        const currentMonthYear = getMonthYearKey(date);
        
        // Filter assignments to only include those in the current month
        const filteredTasks = Object.entries(assignmentsByDate)
            .filter(([dateKey]) => {
                const taskDate = new Date(dateKey);
                return getMonthYearKey(taskDate) === currentMonthYear;
            })
            .reduce((acc, [dateKey, tasks]) => {
                acc[dateKey] = tasks;
                return acc;
            }, {});
            
        // Convert the filtered object to an array of tasks with dates
        const tasksArray = Object.entries(filteredTasks)
            .flatMap(([dateKey, tasks]) => 
                tasks.map(task => ({
                    ...task,
                    formattedDate: new Date(dateKey).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    })
                }))
            )
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            
        setTasksInMonth(tasksArray);
    };

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) throw new Error('No token found.');

                const response = await axios.get(`${apiURL}/api/data/courses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                let allAssignments = [];
                
                // Handle random tasks
                if (response.data[0].randomTasks) {
                    const randomTasks = response.data.flatMap(userTask =>
                        userTask.randomTasks.map(task => ({
                            title: task.title,
                            description: task.description,
                            dueDate: formatDateKey(new Date(task.dueDate)),
                            course: "Extra Task"
                        }))
                    );
                    allAssignments = [...randomTasks];
                }

                // Handle course assignments
                if (response.data[0].courses) {
                    const courseAssignments = response.data.flatMap(userCourse =>
                        userCourse.courses.flatMap(course =>
                            course.assignments.map(assignment => ({
                                title: assignment.title,
                                course: course.title,
                                weight: assignment.weight,
                                dueDate: formatDateKey(new Date(assignment.dueDate))
                            }))
                        )
                    );
                    allAssignments = [...allAssignments, ...courseAssignments];
                }

                // Group by date
                const grouped = allAssignments.reduce((acc, assignment) => {
                    if (!acc[assignment.dueDate]) acc[assignment.dueDate] = [];
                    acc[assignment.dueDate].push(assignment);
                    return acc;
                }, {});

                setAssignmentsByDate(grouped);
                filterTasksByMonth(currentDate);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        fetchAssignments();
    }, []);

    // Group tasks by date for display
    const tasksByDate = tasksInMonth.reduce((groups, task) => {
        const date = task.formattedDate;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(task);
        return groups;
    }, {});

    return (
        <div className="list-view">
            <PageHeader 
                currentDate={currentDate}
                onDateChange={handleDateClick}
                togglePopup={togglePopup}
            />
            
            <div className="list-container">
                {Object.keys(tasksByDate).length > 0 ? (
                    Object.entries(tasksByDate).map(([date, tasks]) => (
                        <div className="date-section" key={date}>
                            <h2>{date}</h2>
                            <div className="tasks">
                                {tasks.map((task, index) => (
                                    <div key={index} className="task-item">
                                        <div className="task-left">
                                            <input type="checkbox" className="checkbox" />
                                            <span>{task.title}</span>
                                        </div>
                                        <div className="task-right">
                                            <span className="time">
                                                {new Date(task.dueDate).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            <div className="class-tag">{task.course}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-tasks">
                        <p>No tasks for this month.</p>
                    </div>
                )}
            </div>
            {showPopup && <TaskPopup onSave={() => setShowPopup(false)} />}
        </div>
    );
};

export default ListView;