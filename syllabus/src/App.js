import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SylaScan from './components/SylaScan';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Signup from './components/Signup';
import GoogleAuthCallback from './components/GoogleAuthCallback'

export default function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/api/auth/callback/google" element={<GoogleAuthCallback />} />
        </Routes>
      </Router>
    </div>
  )
}
