import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import '../App.css';
import fileIcon from '../assets/file_icon.png';
import trashIcon from '../assets/trash.png';

export default function SylaScan() {
    const [uploadedSyllabi, setUploadedSyllabi] = useState([]);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setUploadedSyllabi([...uploadedSyllabi, selectedFile.name]);
      }
    };
  
    const handleDelete = (index) => {
      const updatedList = uploadedSyllabi.filter((_, i) => i !== index);
      setUploadedSyllabi(updatedList);
    };
  
    return (
      <div className="syllabus-puller">
        <div className="upload-section">
          <h2>Upload Syllabus</h2>
          <div className="upload-box">
            <div className="icon">
              <img src={fileIcon} alt="File Icon" className="file-icon" />
            </div>
            <button
              className="upload-button"
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
        </div>
      </div>
    );
}
