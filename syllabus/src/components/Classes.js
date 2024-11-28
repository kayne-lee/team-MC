import React, { useState, useEffect } from "react";
import OpenAIService from '../services/OpenAIService';
import SylaScan from "./SylaScan";
import "../styles/classes.css";

const Classes = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([])
    const [checkedAssignments, setCheckedAssignments] = useState({}); // Track checked assignments by course ID
    const openaiService = OpenAIService();
    const [modalVisible, setModalVisible] = useState(false);

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
    //science, math, art, business, coding, other

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

        fetch("http://localhost:8080/api/data/allCourses", requestOptions)
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
                console.log(mappedCourses); // Log the courses for debugging
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
                                
                                <p>
                                    <strong>Instructor:</strong><br></br> {course.instructor}
                                </p>
                                <p>
                                    <strong>Email:</strong><br></br> {course.email}
                                </p>
                                <p>
                                    <strong>Office Location:</strong><br></br> {course.officeLocation}
                                </p>
                                <p>
                                    <strong>Office Hours:</strong> {course.officeHours}
                                </p>
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
                        <h1>{selectedCourse.title}</h1>

                        <div className="course-details-container-inner">
                        {/* Assignments Section */}
                        <div className="assignments-section">
                            <h3>Assignments</h3>
                            <ul>
                                {selectedCourse.assignments.map((assignment) => (
                                    <li key={assignment.id}>
                                        <input
                                            type="checkbox"
                                            checked={
                                                checkedAssignments[selectedCourse.id]?.[assignment.id] || false
                                            }
                                            onChange={() =>
                                                toggleAssignmentCheck(selectedCourse.id, assignment.id)
                                            }
                                        />
                                        <span>
                                            {assignment.title} - {assignment.weight} - {assignment.dueDate}
                                        </span>
                                    </li>
                                ))}
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
                    {/* <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-2xl font-semibold">Course Modal</h2>
                        <p className="my-4">Enter course details here...</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div> */}
                    <SylaScan closeModal={closeModal}/>
                </div>
            )}
        </div>
    );
};

export default Classes;
