import React, { useState } from "react";
import "../styles/classes.css";

const Classes = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);

    const courses = [
        {
            id: 1,
            title: "CISC 101",
            instructor: "Wendy Powley",
            email: "wendy.powley@queensu.ca",
            officeLocation: "Goodwin 729",
            officeHours: "Wed 10:00 AM - 11:00 AM",
            image: "path/to/cisc101-image.jpg",
        },
        {
            id: 2,
            title: "MATH 112",
            instructor: "Wendy Powley",
            email: "wendy.powley@queensu.ca",
            officeLocation: "Goodwin 729",
            officeHours: "Wed 10:00 AM - 11:00 AM",
            image: "path/to/math112-image.jpg",
        },
        {
            id: 3,
            title: "JAPN 100",
            instructor: "Wendy Powley",
            email: "wendy.powley@queensu.ca",
            officeLocation: "Goodwin 729",
            officeHours: "Wed 10:00 AM - 11:00 AM",
            image: "path/to/japn100-image.jpg",
        },
    ];

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
    };

    return (
        <div className="courses-page">
            {/* Sidebar */}
            <div className="sidebar">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className={`course-card ${selectedCourse?.id === course.id ? "selected" : ""}`}
                        onClick={() => handleCourseSelect(course)}
                    >
                        <img src={course.image} alt={course.title} className="course-image" />
                        <div className="course-details">
                            <h2>{course.title}</h2>
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
                ))}
            </div>

            {/* Main Content */}
            <div className="main-content">
                {selectedCourse ? (
                    <div className="course-details-container">
                        <h1>{selectedCourse.title}</h1>
                        <div className="progress-section">
                            <h3>Progress</h3>
                            {/* Replace this with actual progress data */}
                            <p>100% Completed</p>
                        </div>
                        <div className="assignments-section">
                            <h3>Assignments</h3>
                            {/* Replace this with dynamic assignments */}
                            <ul>
                                <li>Homework 1 - 5% - 9/23/24</li>
                                <li>Quiz 1 - 10% - 9/23/24</li>
                                <li>Midterm - 20% - 10/31/24</li>
                                <li>Final Exam - 40% - 12/20/24</li>
                            </ul>
                        </div>
                        <div className="statistics-section">
                            <div>
                                <h4>Uncompleted Tasks</h4>
                                <p>9</p>
                            </div>
                            <div>
                                <h4>Completed Tasks</h4>
                                <p>1</p>
                            </div>
                            <div>
                                <h4>Grade Calculator</h4>
                                <p>100%</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="placeholder">
                        <h2>Select a course to view details</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Classes;