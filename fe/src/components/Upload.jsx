import React, { useState } from 'react';
import pdfToText from 'react-pdftotext'
import OpenAIService from '../services/OpenAIService';

export default function Upload() {
    const [inputText, setInputText] = useState('');
    const [courseDates, setCourseDates] = useState('');
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

    return (
        <div>
          <input type="file" accept="application/pdf" onChange={extractText} />
          <p>Extracted Text:</p>
          <textarea value={inputText} readOnly rows={10} cols={50} />
          <div hidden = {!inputText}>
            <p>Successfully uploaded syllabus!</p>
            <button onClick = {getCourseDates}>Generate course dates</button>
          </div>
        </div>
    );
}