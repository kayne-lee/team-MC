import React, { useState, useEffect } from "react";
import OpenAIService from '../services/OpenAIService';
import SylaScan from "./SylaScan";
import "../styles/classes.css";
import info from "../assets/info.png"
import { useNavigate } from 'react-router-dom';
import GoogleService from "../services/GoogleService";

const Classes = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([])
    const [checkedAssignments, setCheckedAssignments] = useState({}); // Track checked assignments by course ID
    const [modalVisible, setModalVisible] = useState(false);
    const [percentages, setPercentages] = useState({});
    const [modifiedGrades, setModifiedGrades] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const googleService = GoogleService();
    const apiUrl = process.env.REACT_APP_NUCLEUS_API; // This will get the value from .env file
    var access_token = localStorage.getItem("access_token");

    useEffect(() => {
        access_token = localStorage.getItem("access_token");
      }, []);

    const handleGoogleAuth = () => {
        console.log("ID", process.env.REACT_APP_CLIENT_ID)
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${process.env.REACT_APP_CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/callback/google')}` +
          `&response_type=code` +
          `&scope=${encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar')}` +
          `&access_type=offline`;
      
        window.location.href = authUrl;
    
      };
    function convertDate(inputDate) {
        let [month, day, year] = inputDate.split("/");
        year = parseInt(year, 10) < 100 ? `20${year}` : year;

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    // Handle input change for percentage input
    const handlePercentageChange = (e, courseTitle, assignmentTitle) => {
        const value = e.target.value;
        const uniqueId = `${courseTitle}-${assignmentTitle}`;
        
        if (value >= 0 && value <= 100) {
            setPercentages((prev) => ({
                ...prev,
                [uniqueId]: value,
            }));
            
            setModifiedGrades(prev => ({
                ...prev,
                [uniqueId]: true
            }));
        }
    };

    // Function to handle opening the modal
    const openModal = () => {
        setModalVisible(true);
        document.body.classList.add("blurred"); // Apply blur to body
    };

    // Function to handle closing the modal
    const closeModal = () => {
        setModalVisible(false);
        document.body.classList.remove("blurred"); // Remove blur from body
    };

    useEffect(() => {
        const myHeaders = new Headers();
        const token = localStorage.getItem("jwt");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(`${apiUrl}/api/data/allCourses`, requestOptions)
            .then((response) => {
                // Check if the response status is 401 (Unauthorized - token expired)
                if (response.status === 401) {
                    return response.json().then((data) => {
                        if (data.message === "Token is expired") {
                            localStorage.removeItem('jwt'); // or sessionStorage.removeItem('jwtToken');

                            // Navigate to the login page
                            navigate("/login");
                        }
                    });
                }
                return response.json(); // If status is not 401, parse as JSON
            })
            .then((res) => {
                console.log(res)
                // Mapping the response to match the desired structure
                const mappedCourses = res.map((course, index) => ({
                    id: index + 1, // Assigning a unique id for each course
                    title: course.title,
                    instructor: course.instructor,
                    email: course.email,
                    officeLocation: course.officeLocation,
                    officeHours: course.officeHours,
                    image: `/courseImages/${course.category}.jpg`,
                    assignments: course.assignments.map((assignment, idx) => ({
                        id: idx + 1, // Assigning a unique id for each assignment
                        title: assignment.title,
                        weight: assignment.weight,
                        dueDate: new Date(assignment.dueDate).toLocaleDateString('en-US', {
                            year: '2-digit',
                            month: 'numeric',
                            day: 'numeric'
                        }),
                        description: assignment.description,
                        grade: assignment.grade,
                        isCompleted: assignment.isCompleted
                    })),
                }));

                setCourses(mappedCourses); // Set the state with the fetched and mapped courses
                

            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                localStorage.removeItem('jwt'); // or sessionStorage.removeItem('jwtToken');

                // Navigate to the login page
                navigate("/login");
            });
    }, []);

    // When courses are loaded, set initial checked state based on completionStatus
    useEffect(() => {
        const initialCheckedState = {};
        
        courses.forEach(course => {
            initialCheckedState[course.id] = {};
            course.assignments.forEach(assignment => {
                initialCheckedState[course.id][assignment.id] = assignment.isCompleted || false;
            });
        });
        
        setCheckedAssignments(initialCheckedState);
    }, [courses]);

    const uploadToCalendar = async () => {
        if (!access_token) {
            handleGoogleAuth()
        }
        else {
            console.log(courses)
            for (const course of courses) {
               
                for (const assignment of course.assignments) {
            
                    const calDate = convertDate(assignment.dueDate)
                    await googleService.createCalendarEvent(calDate, assignment.title, assignment.weight, assignment.description, course.title)
                }
            }
            alert('Calendar Upload Complete')
        }
        
    }
    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        if (!checkedAssignments[course.id]) {
            setCheckedAssignments((prev) => ({
                ...prev,
                [course.id]: {},
            }));
        }
    };

    const toggleAssignmentCheck = async (courseId, assignmentId, courseTitle, assignmentTitle) => {
        // Get the new checked state (opposite of current state)
        const newCheckedState = !checkedAssignments[courseId]?.[assignmentId];
        
        // Update local state first for immediate UI feedback
        setCheckedAssignments((prev) => ({
            ...prev,
            [courseId]: {
                ...prev[courseId],
                [assignmentId]: newCheckedState,
            },
        }));

        try {
            const token = localStorage.getItem("jwt");
            const response = await fetch(`${apiUrl}/api/data/updateCompletionStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify([{
                    courseTitle: courseTitle,
                    assignmentTitle: assignmentTitle,
                    isCompleted: newCheckedState
                }])
            });
            console.log(JSON.stringify([{
                courseTitle: courseTitle,
                assignmentTitle: assignmentTitle,
                isCompleted: newCheckedState
            }]))

            if (!response.ok) {
                // If the request fails, revert the checkbox state
                setCheckedAssignments((prev) => ({
                    ...prev,
                    [courseId]: {
                        ...prev[courseId],
                        [assignmentId]: !newCheckedState,
                    },
                }));
                throw new Error('Failed to update completion status');
            }
        } catch (error) {
            console.error('Error updating completion status:', error);
            // Optional: Show error message to user
            alert('Failed to update completion status. Please try again.');
        }
    };

    // Update handleSaveGrades to include loading states
    const handleSaveGrades = async () => {
        const gradeUpdates = [];
        
        // Collect all modified grades
        courses.forEach(course => {
            course.assignments.forEach(assignment => {
                // Create a unique identifier that includes both course and assignment
                const uniqueId = `${course.title}-${assignment.title}`;
                
                if (modifiedGrades[uniqueId] && percentages[uniqueId]) {
                    gradeUpdates.push({
                        courseTitle: course.title,
                        assignmentTitle: assignment.title,
                        grade: parseFloat(percentages[uniqueId])
                    });
                }
            });
        });

        if (gradeUpdates.length === 0) {
            alert('No grades to update');
            return;
        }

        try {
            setIsSaving(true);
            const token = localStorage.getItem("jwt");
            const response = await fetch(`${apiUrl}/api/data/updateGrades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(gradeUpdates)
            });
            console.log(gradeUpdates)

            if (!response.ok) {
                throw new Error('Failed to update grades');
            }
            

            const results = await response.json();
            console.log(results)
            // Clear modified grades tracking after successful save
            setModifiedGrades({});
            
            // Show success state
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 1500); // Show checkmark for 1.5 seconds
            
        } catch (error) {
            console.error('Error saving grades:', error);
            setIsSaving(false);
            alert('Failed to save grades. Please try again.');
        }
    };

    const calculateGrade = (course) => {
        if (!course || !course.assignments) return 0;

        // Filter for completed assignments only
        const completedAssignments = course.assignments.filter(
            assignment => checkedAssignments[course.id]?.[assignment.id]
        );

        if (completedAssignments.length === 0) return 0;

        // Calculate total weight of completed assignments
        const totalCompletedWeight = completedAssignments.reduce((sum, assignment) => {
            // Remove the % symbol and convert to float
            const weight = parseFloat(assignment.weight.replace('%', ''));
            return sum + weight;
        }, 0);

        if (totalCompletedWeight === 0) return 0;

        // Calculate weighted sum of grades
        let weightedSum = 0;
        completedAssignments.forEach(assignment => {
            const weight = parseFloat(assignment.weight.replace('%', ''));
            const grade = percentages[`${course.title}-${assignment.title}`] || assignment.grade || 0;
            
            // Adjust weight relative to total completed weight
            const adjustedWeight = (weight / totalCompletedWeight) * 100;
            weightedSum += (grade * adjustedWeight) / 100;
        });

        return weightedSum.toFixed(1);
    };

    return (
        <div className="courses-page">
            {/* Sidebar */}
            <div className="sidebar">
                {
                    courses.map((course) => (
                        <div
                            key={course.id}
                            className={`course-card ${selectedCourse?.id === course.id ? "selected" : ""}`}
                            onClick={() => handleCourseSelect(course)}
                        >
                            <div>
                                <img src={course.image} alt={course.title} className="course-image" />
                                <h2 className="course-title">{course.title}</h2>
                            </div>
                            <div className="course-details">
                                <div className="flex flex-col">
                                    <div class="text-black font-poppins text-sm font-bold leading-[125%]">Instructor:</div>
                                    <div class="text-[#8B898D] font-poppins text-sm font-normal leading-[125%]">{course.instructor}</div>
                                </div>
                                <div className="flex flex-col">
                                    <div class="text-black font-poppins text-sm font-bold leading-[125%]">Email:</div>
                                    <div class="text-[#8B898D] font-poppins text-sm font-normal leading-[125%]">{course.email}</div>
                                </div>
                                <div className="flex flex-col">
                                    <div class="text-black font-poppins text-sm font-bold leading-[125%]">Office Location:</div>
                                    <div class="text-[#8B898D] font-poppins text-sm font-normal leading-[125%]">{course.officeLocation}</div>
                                </div>
                                <div className="flex flex-col">
                                    <div class="text-black font-poppins text-sm font-bold leading-[125%]">Office Hours:</div>
                                    <div class="text-[#8B898D] font-poppins text-sm font-normal leading-[125%]">{course.officeHours}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {/* ADD COURSES BUTTON */}
                <div className="add-course-card" onClick={openModal}>
                    <div className="add-icon">
                        <span>+</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {selectedCourse ? (
                    <div className="course-details-container">
                        <div className="flex flex-row items-center justify-between gap-[10px] w-full">
                            <div className="flex flex-row items-center gap-[10px]">
                                <div class="text-black font-extrabold text-[35.398px] leading-normal font-inter">{selectedCourse.title}</div>
                                <img src={info} alt="" className="w-[24px] h-[24px]"/>
                            </div>
                        </div>
                        

                        <div className="course-details-container-inner">
                        {/* Assignments Section */}
                        <div className="assignments-section">
                        <ul>
                            {selectedCourse.assignments.map((assignment) => {
                                const inputColor = checkedAssignments[selectedCourse.id]?.[assignment.id] ? 'border-purple-500 text-purple-500' : 'border-[#272627] text-[#272627]';
                                const bgColor = checkedAssignments[selectedCourse.id]?.[assignment.id] ? 'bg-purple-100' : 'bg-white';

                                return (
                                <li key={assignment.id}>
                                    <input
                                    type="checkbox"
                                    checked={checkedAssignments[selectedCourse.id]?.[assignment.id] || false}
                                    onChange={() => toggleAssignmentCheck(
                                        selectedCourse.id, 
                                        assignment.id,
                                        selectedCourse.title,
                                        assignment.title
                                    )}
                                    />
                                    <div className="flex flex-row w-full ml-[15px] justify-between">
                                    <div className="flex flex-col">
                                        <div className={`text-[#333] font-bold text-[15.732px] max-w-[120px] leading-normal ${inputColor}`}>
                                        {assignment.title}
                                        </div>
                                        <div className="flex flex-row justify-between text-[#8B898D] font-poppins font-bold text-[12.275px] leading-normal w-[107px]">
                                        <div>{assignment.weight}</div>
                                        <div>{assignment.dueDate}</div>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex ml-[20px] items-center border-[1.816px] rounded-[18.637px] ${inputColor} ${bgColor} w-[53px] h-[33px]`}
                                    >
                                        <input
                                        className={`w-[calc(100%-15px)] h-full text-right border-none rounded-[18.637px] ${bgColor} focus:outline-none px-0`}
                                        type="number"
                                        value={percentages[`${selectedCourse.title}-${assignment.title}`] || ''}
                                        min="0"
                                        max="100"
                                        placeholder={assignment.grade}
                                        aria-label="Percentage"
                                        onChange={(e) => handlePercentageChange(e, selectedCourse.title, assignment.title)}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        />
                                        <span className="text-center font-poppins text-[14.526px] font-bold leading-normal">%</span>
                                    </div>
                                    </div>
                                </li>
                                );
                            })}
                            </ul>
                        </div>
                        {/* Flex that contains both meeting and stat sections */}
                        <div>
                            {/* Meeting information Section */}
                            <div className="meeting-information-section">
                                
                              
                                <p>
                                    <strong>Instructor:</strong><br></br> {selectedCourse.instructor}<br></br>{selectedCourse.email}
                                </p>
                                <p>
                                    <strong>Office Location:</strong><br></br> {selectedCourse.officeLocation}
                                </p>
                                <p>
                                    <strong>Office Hours:</strong><br></br> {selectedCourse.officeHours}
                                </p>
                            </div>

                            {/* Statistics Section */}
                            
                            <div className="statistics-section">
                                <div className="statistics-top">
                                    <div className="statistics-inner-box">
                                        <h4>Uncompleted Tasks</h4>
                                        <p className="statistic-number">
                                            {
                                                selectedCourse.assignments.filter(
                                                    (a) =>
                                                        !checkedAssignments[selectedCourse.id]?.[a.id]
                                                ).length
                                            }
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <div className="statistics-inner-box">
                                            <h4>Completed Tasks</h4>
                                            <p className="statistic-number">
                                                {
                                                    selectedCourse.assignments.filter(
                                                        (a) =>
                                                            checkedAssignments[selectedCourse.id]?.[a.id]
                                                    ).length
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="statistics-bottom">
                                    <div className="statistics-inner-box-bottom">
                                        <h4>Grade Calculator</h4>
                                        <p className="statistic-number">
                                            {selectedCourse ? `${calculateGrade(selectedCourse)}%` : '0%'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                    <div className="placeholder">
                        <h2>Add a course to see details</h2>
                    </div>
                )}
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={handleSaveGrades}
                        disabled={Object.keys(modifiedGrades).length === 0 || isSaving}
                        className={`
                            relative flex items-center justify-center
                            w-32 h-12 rounded-lg px-6 py-3 shadow-md
                            transition duration-200
                            ${isSaving || showSuccess 
                                ? 'bg-purple-500 text-white cursor-not-allowed'
                                : Object.keys(modifiedGrades).length === 0
                                    ? 'bg-purple-300 text-white cursor-not-allowed'
                                    : 'bg-purple-500 text-white hover:bg-purple-600'
                            }
                        `}
                    >
                        {isSaving ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : showSuccess ? (
                            <svg 
                                className="w-6 h-6 text-white animate-scale-check" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                        ) : (
                            'Save Grades'
                        )}
                    </button>
                    
                    {/* Existing Calendar button */}
                    <button
                        onClick={uploadToCalendar}
                        className="bg-white text-black border border-gray-300 rounded-lg px-6 py-3 shadow-md hover:bg-gray-100 transition duration-200"
                    >
                        {access_token ? "Upload to Calendar" : "Connect Google Calendar"}
                    </button>
                </div>
            </div>
            {modalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <SylaScan closeModal={closeModal}/>
                </div>
            )}
        </div>
    );
};

export default Classes;
