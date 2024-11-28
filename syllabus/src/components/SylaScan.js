import React, { useState, useEffect } from 'react';
import '../App.css';
import fileIcon from '../assets/file_icon.png';
import trashIcon from '../assets/trash.png';
import OpenAIService from '../services/OpenAIService';
import MongoService from '../services/MongoService';

import pdfToText from 'react-pdftotext';
import loader from '../assets/loader3.gif';

export default function SylaScan({ closeModal }) {
  const [uploadedSyllabi, setUploadedSyllabi] = useState([]);
  const [showFetchDates, setShowFetchDates] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [inputText, setInputText] = useState("");
  const [jsonData, setJsonData] = useState({
    title: "",
    assignments: [],
    courseInfo: {
      instructorName: "",
      instructorEmail: "",
      officeHoursTime: "",
      officeHoursLocation: "",
      category: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false); // Error state
  const openaiService = OpenAIService();
  const mongoService = MongoService();

  const handleFileChange = (e) => {
    setShowSuccessMessage(false);
    setHasError(false); // Reset error state on new file
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setUploadedSyllabi([...uploadedSyllabi, selectedFile.name]);
      pdfToText(selectedFile)
        .then(text => {
          console.log(text);
          setInputText(text);
        })
        .catch(error => {
          console.error("Failed to extract text from pdf");
          setHasError(true); // Set error state
        });
      setShowFetchDates(true);
    }
  };

  const handleDelete = (index) => {
    const updatedList = uploadedSyllabi.filter((_, i) => i !== index);
    setUploadedSyllabi(updatedList);
    if (updatedList.length === 0) {
      setShowFetchDates(false);
      setJsonData({
        title: "",
        assignments: [],
        courseInfo: {
          instructorName: "",
          instructorEmail: "",
          officeHoursTime: "",
          officeHoursLocation: "",
          category: ""
        }
      });
    }
  };

  async function fetchDates() {
    setJsonData({
      title: "",
      assignments: [],
      courseInfo: {
        instructorName: "",
        instructorEmail: "",
        officeHoursTime: "",
        officeHoursLocation: "",
        category: ""
      }
    });
    setLoading(true);
    const data = await openaiService.openAICall(inputText);
    console.log(data);
    setJsonData(data);
    setLoading(false);
  }

  async function saveInfo() {
    setLoading(true);
    console.log("SAVING:", jsonData);
    const res = await mongoService.saveCourseInfo(jsonData);
    setJsonData({
      title: "",
      assignments: [],
      courseInfo: {
        instructorName: "",
        instructorEmail: "",
        officeHoursTime: "",
        officeHoursLocation: "",
        category: ""
      }
    });
    setUploadedSyllabi([]);
    setLoading(false);
    setShowFetchDates(false);
    setShowSuccessMessage(true);
  }

  const handleInputChange = (index, field, value, section) => {
    if (section === "assignments") {
      const updatedData = [...jsonData.assignments];
      updatedData[index][field] = value;
      setJsonData({
        ...jsonData,
        assignments: updatedData
      });
    } else if (section === "courseInfo") {
      setJsonData({
        ...jsonData,
        courseInfo: {
          ...jsonData.courseInfo,
          [field]: value
        }
      });
    }
  };

  const handleAddRow = () => {
    const newRow = { title: "", weight: "", dueDate: "", description: "" }; // Default empty row with description
    setJsonData({
      ...jsonData,
      assignments: [...jsonData.assignments, newRow]
    });
  };

  const handleDeleteRow = (index) => {
    const updatedData = jsonData.assignments.filter((_, i) => i !== index);
    setJsonData({
      ...jsonData,
      assignments: updatedData
    });
  };

  const handleBack = () => {
    setShowFetchDates(false);
    setJsonData({
      title: "",
      assignments: [],
      courseInfo: {
        instructorName: "",
        instructorEmail: "",
        officeHoursTime: "",
        officeHoursLocation: "",
        category: ""
      }
    });
    setUploadedSyllabi([]);
    setHasError(false); // Reset error on going back
  };

  return (
    <div className="">
      <div className="w-[988px] h-[540px] flex flex-col justify-center items-center bg-white rounded-[45px] border-[8px] border-[#8338EC] ">
      <button
          onClick={closeModal}
          className="absolute top-[140px] right-[250px] text-3xl font-bold text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {!hasError ? (
          <>
            {/* Initial Upload Button */}
            {!showFetchDates && (
              <>
                <div className="icon">
                  <img src={fileIcon} alt="File Icon" className="file-icon" />
                </div>
                <button
                  className="upload-button hover:bg-[#BFA1E9]"
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
              </>
            )}

            {/* Show "Generating" State */}
            {showFetchDates && !loading && jsonData.assignments.length <= 0 && (
              <div className="uploaded-syllabi" hidden={!showFetchDates && (jsonData.assignments.length === 0)}>
                <ul>
                  {uploadedSyllabi.map((syllabus, index) => (
                    <li key={index} className="syllabus-item">
                      <span className="">{syllabus}</span>
                      <img src={trashIcon} alt="Trash Icon" className="delete-button" onClick={() => handleDelete(index)} />
                    </li>
                  ))}
                </ul>
                <button hidden={!showFetchDates && (jsonData.assignments.length === 0)} onClick={fetchDates} className="upload-button hover:bg-[#BFA1E9]">
                  Generate Course Dates
                </button>
              </div>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div className="flex flex-col justify-center items-center w-full">
                <img src={loader} alt="Loader" />
                <h2 style={{ textAlign: "center" }}>
                  {jsonData.assignments.length === 0 ? "Scanning For Course Assessments" : "Saving Your Course Data"}
                </h2>
              </div>
            )}

            {/* Assignment Table and Edit */}
            {!loading && jsonData.assignments.length > 0 && (
              <div className="w-full p-[25px]">
                <h2 style={{ textAlign: "center" }} className="text-black font-inter text-[31.052px] font-bold not-italic leading-none mb-[20px]">
                  {jsonData.title} Assessments
                </h2>
                {/* Course Info Table Edit */}
                <div className="flex justify-center items-center w-full mb-4">
                  <table className="">
                    <tbody>
                      <tr>
                        <td className="w-[150px]">Instructor Name:</td>
                        <td>
                          <input
                            type="text"
                            value={jsonData.courseInfo.instructorName}
                            onChange={(e) =>
                              handleInputChange(null, "instructorName", e.target.value, "courseInfo")
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Instructor Email:</td>
                        <td>
                          <input
                            type="email"
                            value={jsonData.courseInfo.instructorEmail}
                            onChange={(e) =>
                              handleInputChange(null, "instructorEmail", e.target.value, "courseInfo")
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Office Hours:</td>
                        <td>
                          <input
                            type="text"
                            value={jsonData.courseInfo.officeHoursTime}
                            onChange={(e) =>
                              handleInputChange(null, "officeHoursTime", e.target.value, "courseInfo")
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Office Location:</td>
                        <td>
                          <input
                            type="text"
                            value={jsonData.courseInfo.officeHoursLocation}
                            onChange={(e) =>
                              handleInputChange(null, "officeHoursLocation", e.target.value, "courseInfo")
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Assignments Table */}
                <table className="mt-[10px]" border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th className="w-[10px] text-left">Title</th>
                      <th className="w-[10px] text-left">Weight</th>
                      <th className="w-[10px] text-left">Due Date</th>
                      <th className="w-[10px] text-left">Description</th>
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
                              handleInputChange(index, "title", e.target.value, "assignments")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.weight}
                            onChange={(e) =>
                              handleInputChange(index, "weight", e.target.value, "assignments")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="datetime-local"
                            value={row.dueDate}
                            onChange={(e) =>
                              handleInputChange(index, "dueDate", e.target.value, "assignments")
                            }
                          />
                        </td>
                        <td className="w-[200px]">
                          <input
                            type="text"
                            value={row.description}
                            onChange={(e) =>
                              handleInputChange(index, "description", e.target.value, "assignments")
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
            )}

            {/* Save Button */}
            <button hidden={jsonData.assignments.length === 0 || loading} onClick={saveInfo} className="upload-button mt-[20px]">
              Save Course Info
            </button>
            <h1 hidden={!showSuccessMessage}>Congrats! Your course has been saved to your profile.</h1>

          </>
        ) : (
          // Error Message with Back Button
          <div>
            <h2>There was an error extracting the syllabus. Please try again.</h2>
            <button onClick={handleBack}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
