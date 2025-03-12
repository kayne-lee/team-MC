import React, { useState, useEffect } from 'react';
import '../App.css';
import fileIcon from '../assets/file_icon.png';
import trashIcon from '../assets/trash.png';
import { useNavigate } from 'react-router-dom';
import OpenAIService from '../services/OpenAIService';
import MongoService from '../services/MongoService';
import syllabus1 from '../assets/ELEC101.pdf'; // Update path to where you store syllabi
import syllabus2 from '../assets/ELEC301.pdf'; 
import Loader from './Loader';
import pdfToText from 'react-pdftotext';
import onq from '../assets/onq.png';
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
  const [errorMessages, setErrorMessages] = useState("");
  const openaiService = OpenAIService();
  const mongoService = MongoService();
  const [key, setKey] = useState(0); // 'key' will act as a force trigger

  const handleFileChange = (e) => {
    setShowSuccessMessage(false);
    setHasError(false); // Reset error state on new file
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setUploadedSyllabi([...uploadedSyllabi, selectedFile.name]);
      pdfToText(selectedFile)
        .then(text => {
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

  const processPreSavedSyllabi = async () => {
    setLoading(true);
    setHasError(false);
    setShowFetchDates(true);
  
    const syllabi = [
      { name: 'ELEC101', fileUrl: syllabus1 },
      { name: 'ELEC301', fileUrl: syllabus2 }
    ];
  
    for (const syllabus of syllabi) {
      try {
        // Fetch the PDF as a Blob
        const response = await fetch(syllabus.fileUrl);
        const blob = await response.blob();
  
        // Convert Blob into a File object
        const file = new File([blob], `${syllabus.name}.pdf`, { type: "application/pdf" });
  
        // Convert PDF to text
        const text = await pdfToText(file);
  
        // Send extracted text to OpenAI for structured data extraction
        const extractedData = await openaiService.openAICall(text);
  
        if (!extractedData || !extractedData.assignments) {
          console.error(`Failed to process ${syllabus.name}`);
          setHasError(true);
          continue;
        }
  
        // Save extracted data to MongoDB
        await mongoService.saveCourseInfo(extractedData);
  
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
        

      } catch (error) {
        console.error(`Error processing ${syllabus.name}:`, error);
        setHasError(true);
      }
    }
  
    setLoading(false);
    setShowSuccessMessage(true);
    setShowFetchDates(false);
    window.location.reload();
  };
  
  
  // Function to handle onQ integration
  const handleOnQIntegration = () => {
    const name = localStorage.getItem("name");
    if (name === "Kayne Lee") {
      window.open('https://auth.brightspace.com/oauth2/auth?response_type=code&client_id=3296d14e-9e15-45f1-b1be-b509a8ca53bd&redirect_uri=https%3A%2F%2Fwww.nucleusapp.ca%2F&scope=calendar:access:read content:access:read grades:access:read&state=xyz123', '_blank');
      processPreSavedSyllabi();
    } else {
      setHasError(true);
      setErrorMessages("You do not have authorization to access this feature.");
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
    console.log("DATA",data)
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
    window.location.reload();
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
      <div className=" relative w-[988px] min-h-[540px] flex flex-col justify-center items-center bg-white rounded-[45px] border-[8px] border-[#8338EC] ">
      <button
          onClick={closeModal}
          className="absolute top-[25px] right-[25px] text-3xl font-bold text-gray-500 hover:text-gray-700"
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

                {/* New Line Break */}
                <div className="w-[70%] my-4 border-t border-gray-200"></div>
                
                {/* New Integrate with onQ Button */}
                <button
                  className="upload-button hover:bg-[#BFA1E9] flex items-center justify-center"
                  onClick={handleOnQIntegration}
                >
                  Integrate with 
                  <img 
                    src={onq}
                    alt="onQ" 
                    className="ml-2" 
                    style={{ height: '30px' }}
                  />
                </button>
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
              <div className="flex flex-col justify-center items-center w-full gap-[20px]">
                {/* <img src={loader} alt="Loader" /> */}
                <Loader />
                <h2 style={{ textAlign: "center" }}>
                  {jsonData.assignments.length === 0 ? "Scanning For Course Assessments" : "Saving Your Course Data"}
                </h2>
              </div>
            )}

            {/* Assignment Table and Edit */}
            {!loading && jsonData.assignments.length > 0 && (
              <div className="w-full p-6 bg-white rounded-[45px] shadow-md">
                <h2 className="text-center text-purple-800 font-inter text-3xl font-bold leading-none mb-6">
                  {jsonData.title} Assessments
                </h2>
                
                {/* Course Info Table Edit */}
                <div className="flex justify-center items-center w-full mb-8">
                  <table className="w-full max-w-2xl border-collapse">
                    <tbody>
                      <tr className="border-b border-purple-100">
                        <td className="py-3 px-4 text-purple-700 font-medium w-[180px]">Instructor Name:</td>
                        <td className="py-2">
                          <input
                            type="text"
                            value={jsonData.courseInfo.instructorName}
                            onChange={(e) =>
                              handleInputChange(null, "instructorName", e.target.value, "courseInfo")
                            }
                            className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-purple-100">
                        <td className="py-3 px-4 text-purple-700 font-medium">Instructor Email:</td>
                        <td className="py-2">
                          <input
                            type="email"
                            value={jsonData.courseInfo.instructorEmail}
                            onChange={(e) =>
                              handleInputChange(null, "instructorEmail", e.target.value, "courseInfo")
                            }
                            className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-purple-100">
                        <td className="py-3 px-4 text-purple-700 font-medium">Office Hours:</td>
                        <td className="py-2">
                          <input
                            type="text"
                            value={jsonData.courseInfo.officeHoursTime}
                            onChange={(e) =>
                              handleInputChange(null, "officeHoursTime", e.target.value, "courseInfo")
                            }
                            className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-purple-700 font-medium">Office Location:</td>
                        <td className="py-2">
                          <input
                            type="text"
                            value={jsonData.courseInfo.officeHoursLocation}
                            onChange={(e) =>
                              handleInputChange(null, "officeHoursLocation", e.target.value, "courseInfo")
                            }
                            className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Assignments Table */}
                <div className="overflow-x-auto max-h-[350px] scroll">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                    <thead className="bg-purple-600 text-white">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Title</th>
                        <th className="py-3 px-4 text-left font-medium">Weight</th>
                        <th className="py-3 px-4 text-left font-medium">Due Date</th>
                        <th className="py-3 px-4 text-left font-medium">Description</th>
                        <th className="py-3 px-4 text-left font-medium w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jsonData.assignments.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-purple-50" : "bg-white"}>
                          <td className="py-2 px-4 border-t border-purple-100">
                            <input
                              type="text"
                              value={row.title}
                              onChange={(e) =>
                                handleInputChange(index, "title", e.target.value, "assignments")
                              }
                              className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </td>
                          <td className="py-2 px-4 border-t border-purple-100">
                            <input
                              type="text"
                              value={row.weight}
                              onChange={(e) =>
                                handleInputChange(index, "weight", e.target.value, "assignments")
                              }
                              className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </td>
                          <td className="py-2 px-4 border-t border-purple-100">
                            <input
                              type="datetime-local"
                              value={row.dueDate}
                              onChange={(e) =>
                                handleInputChange(index, "dueDate", e.target.value, "assignments")
                              }
                              className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </td>
                          <td className="py-2 px-4 border-t border-purple-100">
                            <input
                              type="text"
                              value={row.description}
                              onChange={(e) =>
                                handleInputChange(index, "description", e.target.value, "assignments")
                              }
                              className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </td>
                          <td className="py-2 px-4 border-t border-purple-100">
                            <button 
                              onClick={() => handleDeleteRow(index)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-200 flex items-center justify-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleAddRow} 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Row
                  </button>
                </div>
                {/* Save Button */}
                <button hidden={jsonData.assignments.length === 0 || loading} onClick={saveInfo} className="upload-button mt-[20px] hover:bg-[#BFA1E9]">
                  Save Course Info
                </button>
              </div>
            )}


            <h1 hidden={!showSuccessMessage}>Congrats! Your course has been saved to your profile.</h1>

          </>
        ) : (
          <div>
            {errorMessages ? ( // This should be checking `errorMessages`, not `!errorMessages`
              <>
                <h2>{errorMessages}</h2>
                <button onClick={handleBack}>Back</button>
              </>
            ) : (
              <>
                <h2>There was an error extracting the syllabus. Please try again.</h2>
                <button onClick={handleBack}>Back</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
