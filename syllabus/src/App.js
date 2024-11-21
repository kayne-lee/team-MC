import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SylaScan from './components/SylaScan';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <div className="app">
      <Router>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        </Routes>
      </Router>
    </div>
  )
}
