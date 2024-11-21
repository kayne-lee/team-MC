import Signup from './components/Signup';
import Landing from './components/Landing';
import TasksPage from './components/TasksPage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tasksPage" element={<TasksPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
