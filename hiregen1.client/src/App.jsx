// src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroqChat from './components/GroqChat';
import MissionHistory from './components/MissionHistory';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar /> {/* Include the Navbar component */}
        <main>
          <div className="glass-card"> {/* Apply glass-card here */}
            <Routes>
              <Route path="/" element={<GroqChat />} />
              <Route path="/history" element={<MissionHistory />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
