import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SylaScan from './components/SylaScan';
import TasksPage from './components/TasksPage';

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SylaScan />} />
          <Route path="/tasksPage" element={<SylaScan />} />
          <Route path="/tasksPage" element={<TasksPage />} />
        </Routes>
      </Router>
    </div>
  )
}
