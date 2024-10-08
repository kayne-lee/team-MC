import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission logic here, like sending the email to the backend
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "to": email
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3000/send-email", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    alert('Thank you for signing up to be a beta tester!');
    setEmail('');
  };

  return (
    <div className="bg">
    <div className="App">
      <header className="App-header">
        <h2>Subscribe</h2>
        <p class="card__content">Signup to be a Beta Tester for the Master List Generator
        </p>
        <form onSubmit={handleSubmit}>
          {/* <label htmlFor="email">Enter your email:</label> */}
          <input
            placeholder="Your Email"
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
    </div>
  );
}

export default App;