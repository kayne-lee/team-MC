import React, { useState, useEffect } from "react";
import OpenAIService from '../services/OpenAIService';
import { useNavigate } from 'react-router-dom';
import SylaScan from "./SylaScan";
import "../styles/classes.css";
import info from "../assets/info.png"

const Classes = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([])
    const [checkedAssignments, setCheckedAssignments] = useState({}); // Track checked assignments by course ID
    const [modalVisible, setModalVisible] = useState(false);
    const [percentages, setPercentages] = useState({});

    // Handle input change for percentage input
    const handlePercentageChange = (e, assignmentId) => {
      const value = e.target.value;
      if (value >= 0 && value <= 100) {
        setPercentages((prev) => ({
          ...prev,
          [assignmentId]: value,
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
            redirect: "follow"
        };

        fetch("http://35.183.132.114:8080/api/data/allCourses", requestOptions)
            .then((response) => response.json()) // Parse the response as JSON
            .then((res) => {
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
                    })),
                }));

                setCourses(mappedCourses); // Set the state with the fetched and mapped courses
                

            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
            });
    }, []);

    // Set the first course as the default selected course
    useEffect(() => {
        if (courses.length > 0 && !selectedCourse) {
            setSelectedCourse(courses[0]);
            if (!checkedAssignments[courses[0].id]) {
                setCheckedAssignments((prev) => ({
                    ...prev,
                    [courses[0].id]: {},
                }));
            }
        }
    }, [courses, selectedCourse]);

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        if (!checkedAssignments[course.id]) {
            setCheckedAssignments((prev) => ({
                ...prev,
                [course.id]: {},
            }));
        }
    };

    const toggleAssignmentCheck = (courseId, assignmentId) => {
        setCheckedAssignments((prev) => ({
            ...prev,
            [courseId]: {
                ...prev[courseId],
                [assignmentId]: !prev[courseId]?.[assignmentId], // Toggle checked state
            },
        }));
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
                        <div className="flex flex-row items-center gap-[10px]">
                            <div class="text-black font-extrabold text-[35.398px] leading-normal font-inter">{selectedCourse.title}</div>
                            <img src={info} alt="" className="w-[24px] h-[24px]"/>
                        </div>
                        

                        <div className="course-details-container-inner">
                        {/* Assignments Section */}
                        <div className="assignments-section">
                        <ul>
                            {selectedCourse.assignments.map((assignment) => {
                                const isChecked = checkedAssignments[selectedCourse.id]?.[assignment.id] || false;
                                const inputColor = isChecked ? 'border-purple-500 text-purple-500' : 'border-[#272627] text-[#272627]';
                                const bgColor = isChecked ? 'bg-purple-100' : 'bg-white';

                                return (
                                <li key={assignment.id}>
                                    <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleAssignmentCheck(selectedCourse.id, assignment.id)}
                                    />
                                    <div className="flex flex-row w-full ml-[15px] justify-between">
                                    <div className="flex flex-col">
                                        <div className={`text-[#333] font-bold text-[15.732px] leading-normal ${inputColor}`}>
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
                                        className={`w-[calc(100%-20px)] h-full text-right border-none rounded-[18.637px] ${bgColor} focus:outline-none px-0`}
                                        type="text"
                                        value={percentages[assignment.id] || ''}
                                        min="0"
                                        max="100"
                                        placeholder="_"
                                        aria-label="Percentage"
                                        onChange={(e) => handlePercentageChange(e, assignment.id)}
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
                                            100%
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
