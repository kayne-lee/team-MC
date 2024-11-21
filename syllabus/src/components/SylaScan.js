import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import '../App.css';
import fileIcon from '../assets/file_icon.png';
import trashIcon from '../assets/trash.png';
import OpenAIService from '../services/OpenAIService';
import MongoService from '../services/MognoService';

import pdfToText from 'react-pdftotext'
import loader from '../assets/loader3.gif'

export default function SylaScan() {
    const [uploadedSyllabi, setUploadedSyllabi] = useState([]);
    const [showFetchDates, setShowFetchDates] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [inputText, setInputText] = useState("")
    const [jsonData, setJsonData] = useState({
      title: "",
      assignments: []
    })
    const [loading,setLoading] = useState(false);
    const openaiService = OpenAIService();
    const mongoService = MongoService();

    const handleFileChange = (e) => {
      setShowSuccessMessage(false);
      const selectedFile = e.target.files[0];

      if (selectedFile) {
        setUploadedSyllabi([...uploadedSyllabi, selectedFile.name]);
        pdfToText(selectedFile)
          .then(text =>{
              console.log(text)
              setInputText(text)
          })
          .catch(error => console.error("Failed to extract text from pdf"))
        setShowFetchDates(true);
      }

    };
  
    const handleDelete = (index) => {
      const updatedList = uploadedSyllabi.filter((_, i) => i !== index);
      setUploadedSyllabi(updatedList);
      if (updatedList.length ==0) {
        setShowFetchDates(false);
        setJsonData({
          title: "",
          assignments: []
        })
      }
    };

    async function fetchDates() {
      setJsonData({
        title: "",
        assignments: []
      })
      setLoading(true)
      const data = await openaiService.openAICall(inputText)
      console.log("DATES:", data)
      setJsonData(data)
      setLoading(false)
    }

    async function saveInfo() {
      setLoading(true)
      console.log("SAVING:", jsonData)
      const res = await mongoService.saveCourseInfo(jsonData)
      setJsonData({
        title: "",
        assignments: []
      })
      setUploadedSyllabi([])
      setLoading(false)
      setShowFetchDates(false)
      setShowSuccessMessage(true)
    }

    const handleInputChange = (index, field, value) => {
      console.log(index,field,value)
      const updatedData = [...jsonData.assignments];
      updatedData[index][field] = value;

      const newJson = {
        ...jsonData, // Spread operator to create a new object
        assignments: updatedData, // Replace the assignments array with the updated one
      };

      console.log(newJson);
      setJsonData(newJson); // Update state with the new object reference
    };
    
    const handleAddRow = () => {
      const newRow = { title: "", weight: "", dueDate: "" }; // Default empty row
      setJsonData({ assignments: [...jsonData.assignments, newRow] });
    };
  
    const handleDeleteRow = (index) => {
      const updatedData = jsonData.assignments.filter((_, i) => i !== index);
      setJsonData({ assignments: updatedData });
    };
  
    return (
      <div className="syllabus-puller">
        <Navbar />
        <div className="upload-section">
          <h2>Upload Syllabus</h2>
          <div className="upload-box">
            <div className="icon">
              <img src={fileIcon} alt="File Icon" className="file-icon" />
            </div>
            <button
              className="upload-button"
              hidden = {showFetchDates}
              onClick={() => document.getElementById('fileInput').click()}
            >
              Upload or Attach Syllabus
            </button>
            <input
              type="file"
              id="fileInput"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <h2>Uploaded Syllabi</h2>
        <div className="uploaded-syllabi">
          <ul>
            {uploadedSyllabi.map((syllabus, index) => (
              <li key={index} className="syllabus-item">
                <span>{syllabus}</span>
                <img src={trashIcon} alt="Trash Icon" className="delete-button" onClick={() => handleDelete(index)}>
                </img>
              </li>
            ))}
          </ul>
          <button hidden = {!showFetchDates && (jsonData.assignments.length == 0)} onClick={ fetchDates } className="upload-button">
            Generate Course Dates
          </button>
        </div>
        <div hidden = {!loading}>
          <h2 style={{ textAlign: "center" }}>{jsonData.assignments.length ==0 ? "Scanning For Course Assessments" : "Saving Your Course Data"}</h2>
          <div div style={{ textAlign: "center" }}>
          <img 
            src={loader} 
            alt="Loader" 
            
            // style={{ width: "300px", height: "auto" }} 
          />
          </div>
        </div>
        
        <div hidden ={(jsonData.assignments.length > 0 ? false: true) || loading}>
          <h2 style={{ textAlign: "center" }}>{jsonData.title} Assessments</h2>
          <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Weight</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {jsonData.assignments.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) =>
                        handleInputChange(index, "title", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.weight}
                      onChange={(e) =>
                        handleInputChange(index, "weight", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      id="datetime"
                      type="datetime-local"
                      value={row.dueDate} // Bind the value to the state
                      onChange={(e) =>
                        handleInputChange(index, "dueDate", e.target.value)
                      }
                   
                    
                    />
                  </td>
                  <td>
                    <button onClick={() => handleDeleteRow(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddRow} style={{ marginTop: "10px" }}>
            Add Row
          </button>
        </div>
        <br></br>

        <button hidden={jsonData.assignments.length == 0 || loading} onClick={ saveInfo } className="upload-button">
          Save Course Info
        </button>
        <h1 hidden = {!showSuccessMessage}>Congrats! Your couse has been saved to your profile.</h1>
    
      </div>
    );
}
