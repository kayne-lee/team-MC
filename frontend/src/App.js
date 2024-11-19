import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }
    setOutput("Processing your file...");
  };

  return (
    <div className="App">
      <h1>Upload Syllabus</h1>
      <div className="output-section">
        {output && <p>{output}</p>}
      </div>
      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
}

export default App;
