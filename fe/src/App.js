import Signup from './components/Signup';
import Landing from './components/Landing';
import Home from './components/Home';
import NewHome from './components/NewHome';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/NewHome" element={<NewHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
