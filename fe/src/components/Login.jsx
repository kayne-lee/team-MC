import React, { useState } from 'react';
import axios from 'axios'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "email": formData.email,
        "password": formData.password
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("http://localhost:8080/auth/login", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        localStorage.setItem('jwt', result);

      })
      .catch((error) => console.error("Error during login:", error));
    } else {
      if (formData.password !== formData.confirmPassword) {
        console.log("Passwords don't match!");
      } else {
        console.log('Signing up with:', formData);
        // Add signup logic here
      }
    }
  };

    // Handle Sign Out (clear localStorage and possibly update UI)
    const handleSignOut = () => {
      localStorage.removeItem('jwt'); // Remove the JWT from localStorage
      console.log('You have been logged out!');
      // Optionally, reset form data or change state
      setFormData({
        email: '',
        password: '',
        confirmPassword: ''
      });
      setIsLogin(true); // Switch to Login view after sign out
    };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        {!isLogin && (
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>
        )}
        <br />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
      </button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
