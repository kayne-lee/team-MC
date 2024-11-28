import React, { useState, useEffect } from "react";
import "../styles/classes.css";

const Classes = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [checkedAssignments, setCheckedAssignments] = useState({}); // Track checked assignments by course ID

    const courses = [
        // TODO PLACEHOLDER DATA
        // LATER REPLACE THESE WITH DATABASE CALLS
        {
            id: 1,
            title: "CISC 101",
            instructor: "Wendy Powley",
            email: "wendy.powley@queensu.ca",
            officeLocation: "Goodwin 729",
            officeHours: "Wed 10:00 AM - 11:00 AM",
            image: "/circuits.png",
            assignments: [
                { id: 1, title: "Homework 1", weight: "5%", dueDate: "9/23/24" },
                { id: 2, title: "Quiz 1", weight: "10%", dueDate: "9/30/24" },
                { id: 3, title: "Midterm", weight: "20%", dueDate: "10/31/24" },
                { id: 4, title: "Final Exam", weight: "40%", dueDate: "12/20/24" },
            ],
        },
        {
            id: 2,
            title: "MATH 112",
            instructor: "Wendy Powley",
            email: "wendy.powley@queensu.ca",
            officeLocation: "Goodwin 729",
            officeHours: "Wed 10:00 AM - 11:00 AM",
            image: "/circuits.png",
            assignments: [
                { id: 1, title: "Assignment 1", weight: "10%", dueDate: "9/23/24" },
                { id: 2, title: "Test 1", weight: "20%", dueDate: "10/1/24" },
            ],
        },
    ];

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
                            <img src={course.image} alt={course.title} className="course-image" />
                            <div className="course-details">
                                <h2 className="course-title">{course.title}</h2>
                                <p>
                                    <strong>Instructor:</strong> {course.instructor}
                                </p>
                                <p>
                                    <strong>Email:</strong> {course.email}
                                </p>
                                <p>
                                    <strong>Office Location:</strong> {course.officeLocation}
                                </p>
                                <p>
                                    <strong>Office Hours:</strong> {course.officeHours}
                                </p>
                            </div>
                        </div>
                    ))
                }
                {/* ADD COURSES BUTTON */}
                <div className="add-course-card">
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
                                <h3>Meeting Information</h3>
                                <p>
                                    <strong>Instructor:</strong> {selectedCourse.instructor}
                                </p>
                                <p>
                                    <strong>Email:</strong> {selectedCourse.email}
                                </p>
                                <p>
                                    <strong>Office Location:</strong> {selectedCourse.officeLocation}
                                </p>
                                <p>
                                    <strong>Office Hours:</strong> {selectedCourse.officeHours}
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
        </div>
    );
};

export default Classes;
