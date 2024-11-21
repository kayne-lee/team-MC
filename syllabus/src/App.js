import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SylaScan from './components/SylaScan';
import Login from './components/Login';

export default function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<SylaScan />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  )
}
