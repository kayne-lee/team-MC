import Signup from './components/Signup';
import Landing from './components/Landing';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
