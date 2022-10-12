import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing, StudentLogin, StudentPage, InstructorLogin, InstructorCreate, InstructorJoin, InstructorPage, Header, Help } from "./components";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Landing /> } />
          <Route path="/studentLogin" element={<StudentLogin/>} />
          <Route path="/student" element={<StudentPage/>} />
          <Route path="/instructorLogin" element={<InstructorLogin/>} />
          <Route path="/instructorCreate" element={<InstructorCreate/>} />
          <Route path="/instructorJoin" element={<InstructorJoin/>} />
          <Route path="/instructor" element={<InstructorPage/>} />
          <Route path="/help" element={<Help/>} />
        </Routes> 
      </div>
    </Router>
  )
}

export default App
