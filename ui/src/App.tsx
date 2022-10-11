import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing, LoginStudent, LoginInstructor } from "./components";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="Header">EWOK</div>
        <Routes>
          <Route path="/" element={<Landing /> } />
          <Route path="/studentLogin" element={<LoginStudent/>} />
          <Route path="/instructorLogin" element={<LoginInstructor/>} />
        </Routes> 
      </div>
    </Router>
  )
}

export default App
