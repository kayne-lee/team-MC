import React from 'react';
import '../styles/listView.css';
import { useState, useEffect } from 'react';
import TaskPopup from './TaskPopUp';
import plusIcon from '../assets/plus.png';
import PageHeader from './PageHeader';
import axios from 'axios';
import Loader from "./Loader";

const ListView = () => {
    const [currentDate, setCurrentDate] = useState(() => {
        const savedDate = localStorage.getItem('selectedDate');
        return savedDate ? new Date(savedDate) : new Date();
    });
    const [showPopup, setShowPopup] = useState(false);
    const [tasksInMonth, setTasksInMonth] = useState([]);
    const [assignmentsByDate, setAssignmentsByDate] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editedNoteText, setEditedNoteText] = useState('');
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
        setCurrentDate(selectedDate);
        localStorage.setItem('selectedDate', selectedDate.toISOString());

        // Only filter tasks if data is already loaded
        if (dataLoaded) {
            filterTasksByMonth(selectedDate);
        }
    };

    const filterTasksByMonth = (date) => {
        const currentMonthYear = getMonthYearKey(date);

        // Filter assignments to only include those in the current month
        const filteredTasks = Object.entries(assignmentsByDate)
            .filter(([dateKey]) => {
                const taskDate = new Date(dateKey);
                taskDate.setHours(0, 0, 0, 0); // Ensure the time is set to midnight
                return getMonthYearKey(taskDate) === currentMonthYear;
            })
            .reduce((acc, [dateKey, tasks]) => {
                acc[dateKey] = tasks;
                return acc;
            }, {});

        // Convert the filtered object to an array of tasks with dates
        const tasksArray = Object.entries(filteredTasks)
            .flatMap(([dateKey, tasks]) =>
                tasks.map((task, index) => {
                    const taskDate = new Date(dateKey);
                    taskDate.setDate(taskDate.getDate() + 1); // Add one day to the date
                    return {
                        ...task,
                        id: `${dateKey}-${index}`, // Add unique ID for editing
                        formattedDate: taskDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })
                    };
                })
            )
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        setTasksInMonth(tasksArray);
    };

    // Effect to fetch assignments data
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) throw new Error('No token found.');
                setIsLoaded(true);

                const response = await axios.get(`${apiURL}/api/data/courses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                let allAssignments = [];

                console.log(response)
                
                // Handle random tasks
                if (response.data[0].randomTasks) {
                    const randomTasks = response.data.flatMap(userTask =>
                        userTask.randomTasks.map(task => ({
                            title: task.title,
                            description: task.description,
                            dueDate: formatDateKey(new Date(task.dueDate)),
                            course: "Extra Task",
                            notes: task.notes || ''
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
                                dueDate: formatDateKey(new Date(assignment.dueDate)),
                                notes: assignment.notes || ''
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
                console.log(grouped)
                setAssignmentsByDate(grouped);
                setDataLoaded(true);
                setIsLoaded(false);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        fetchAssignments();
    }, []);

    // Separate effect to filter tasks when either the date changes or data is loaded
    useEffect(() => {
        if (dataLoaded) {
            filterTasksByMonth(currentDate);
        }
    }, [currentDate, dataLoaded, assignmentsByDate]);

    // Group tasks by date for display
    const tasksByDate = tasksInMonth.reduce((groups, task) => {
        const date = task.formattedDate;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(task);
        return groups;
    }, {});

    // Functions to handle note editing
    const handleEditNote = (taskId, currentNote) => {
        setEditingNoteId(taskId);
        setEditedNoteText(currentNote || '');
    };

    const handleSaveNote = async (taskId) => {
        try {
            // Find the task in tasksInMonth
            const taskToUpdate = tasksInMonth.find(t => t.id === taskId);
            
            if (!taskToUpdate) {
                console.error('Task not found:', taskId);
                return;
            }
            
            // Update tasks in state
            const updatedTasks = tasksInMonth.map(task => {
                if (task.id === taskId) {
                    return { ...task, notes: editedNoteText };
                }
                return task;
            });
            setTasksInMonth(updatedTasks);
            
            // Update assignmentsByDate
            const newAssignmentsByDate = { ...assignmentsByDate };
            const dateKey = taskToUpdate.dueDate;
            
            if (newAssignmentsByDate[dateKey]) {
                const taskIndex = newAssignmentsByDate[dateKey].findIndex(t => 
                    t.title === taskToUpdate.title && 
                    t.course === taskToUpdate.course
                );
                
                if (taskIndex !== -1) {
                    newAssignmentsByDate[dateKey][taskIndex] = {
                        ...newAssignmentsByDate[dateKey][taskIndex],
                        notes: editedNoteText
                    };
                }
            }
            setAssignmentsByDate(newAssignmentsByDate);
            
            // Prepare API payload
            const apiPayload = [{
                courseTitle: taskToUpdate.course,
                assignmentTitle: taskToUpdate.title,
                notes: editedNoteText // Adding notes to the payload
            }];
            
            console.log('Sending API payload:', apiPayload);
            
            // For now just log the payload, but eventually will send to API
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error('No token found.');
            
            await axios.post(`${apiURL}/api/data/updateNotes`, apiPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            
            setEditingNoteId(null);
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };


    const handleCancelEdit = () => {
        setEditingNoteId(null);
    };

    return (
        <div className="list-view">
            {isLoaded ? (
                <Loader />
            ) : (
                <>
                <PageHeader 
                currentDate={currentDate}
                onDateChange={handleDateClick}
                togglePopup={togglePopup}
            />
            
            <div className="list-container">
                {dataLoaded ? (
                    Object.keys(tasksByDate).length > 0 ? (
                        Object.entries(tasksByDate).map(([date, tasks]) => (
                            <div className="date-section" key={date}>
                                <h2>{date}</h2>
                                <div className="tasks">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="task-item">
                                            <div className="task-left">
                                                <input type="checkbox" className="checkbox" />
                                                <div className="task-content">
                                                    <span className="task-title">{task.title}</span>
                                                    {/* Notes section - editable or display mode */}
                                                    <div className="task-notes">
                                                        {editingNoteId === task.id ? (
                                                            <div className="edit-note-container">
                                                                <textarea
                                                                    value={editedNoteText}
                                                                    onChange={(e) => setEditedNoteText(e.target.value)}
                                                                    placeholder="Add notes..."
                                                                    className="w-[100%]"
                                                                />
                                                                <div className="flex flex-row">
                                                                    {/* Add Task Button */}
                                                                    <button
                                                                        className="new-task-button mr-[40px]"
                                                                        onClick={() => handleSaveNote(task.id)}
                                                                    >
                                                                        <div class="new-task-button">
                                                                            <div class="new-task-button-inner">
                                                                                <div class="frame-child">
                                                                                </div>
                                                                            </div>
                                                                            <div class="">Save</div>
                                                                        </div>
                                                                    </button>
                                                                    {/* Add Task Button */}
                                                                    <button
                                                                        className="new-task-button mr-[40px]"
                                                                        onClick={handleCancelEdit}
                                                                    >
                                                                        <div class="new-task-button">
                                                                            <div class="new-task-button-inner">
                                                                                <div class="frame-child">
                                                                                </div>
                                                                            </div>
                                                                            <div class="">Cancel</div>
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div 
                                                                className="note-display"
                                                                onClick={() => handleEditNote(task.id, task.notes)}
                                                            >
                                                                {task.notes ? (
                                                                    <p className="note-text">{task.notes}</p>
                                                                ) : (
                                                                    <p className="note-placeholder">Click to add notes...</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
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
                    )
                ) : (
                    <div className="loading">
                        <p>Loading tasks...</p>
                    </div>
                )}
            </div>
            {showPopup && <TaskPopup onSave={() => setShowPopup(false)} />}
                </>
            )}
        </div>
    );
};

export default ListView;