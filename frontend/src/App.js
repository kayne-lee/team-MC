import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission logic here, like sending the email to the backend
    console.log('Email submitted:', email);
    alert('Thank you for signing up to be a beta tester!');
    setEmail('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to be a beta tester!</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;