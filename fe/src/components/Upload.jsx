import React, { useState } from 'react';
import pdfToText from 'react-pdftotext'
import OpenAIService from '../services/OpenAIService';

export default function Upload() {
    const [inputText, setInputText] = useState('');
    const [courseDates, setCourseDates] = useState('');
    const [assignments, setAssignments] = useState([]);
    const openAiService = OpenAIService();

    async function extractText(event) {
        const file = event.target.files[0]
        pdfToText(file)
            .then(text =>{
                setInputText(text)
            })
            .catch(error => console.error("Failed to extract text from pdf"))
    }

    async function getCourseDates(){
        const response = await openAiService.openAICall(inputText)
        console.log(response)
    }

    const formatDueDate = (dueDate) => {
        const date = new Date(dueDate);
        return date.toLocaleString('en-US', {
          timeZone: 'UTC', // Force UTC timezone to avoid local timezone adjustments
          hour12: true, // 12-hour format (AM/PM)
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      };

    async function getDeadlines() {
        const token = localStorage.getItem('jwt');  // Get JWT token from localStorage

    // If token exists, include it in the request header
    if (token) {
      fetch('http://localhost:8080/api/data/courses', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Flatten the course assignments data
          const allAssignments = data.flatMap((user) =>
            user.courses.flatMap((course) =>
              course.assignments.map((assignment) => ({
                title: assignment.title,
                course: course.title,
                weight: assignment.weight,
                dueDate: assignment.dueDate,
              }))
            )
          );
          setAssignments(allAssignments);
        })
        .catch((error) => console.error('Error fetching assignments:', error));
    } else {
      console.error('JWT token not found in localStorage');
    }
        
    }

    return (
        <div>
          <input type="file" accept="application/pdf" onChange={extractText} />
          <p>Extracted Text:</p>
          <textarea value={inputText} readOnly rows={10} cols={50} />
          <div hidden = {!inputText}>
            <p>Successfully uploaded syllabus!</p>
            <button onClick = {getCourseDates}>Generate course dates</button>
            
          </div>
          <div>
          <button onClick = {getDeadlines}>Get deadlines</button>
      <h2>Assignments</h2>
      <ul>
        {assignments.map((assignment, index) => (
          <li key={index}>
            <strong>Title:</strong> {assignment.title} <br />
            <strong>Course:</strong> {assignment.course} <br />
            <strong>Weight:</strong> {assignment.weight} <br />
            <strong>Due Date:</strong> {formatDueDate(assignment.dueDate)} <br />
            <hr />
          </li>
        ))}
      </ul>
    </div>
        </div>
    );
}