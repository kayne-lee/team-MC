import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SylaScan from './components/SylaScan';

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SylaScan />} />
        </Routes>
      </Router>
    </div>
  )
}
