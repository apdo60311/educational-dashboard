import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CategoryManager from "./components/CategoryManager";
import QuestionManager from "./components/QuestionManager";
import StudentManager from "./components/StudentManager";
import AccessCodeManager from "./components/AccessCodeManager";
import "./styles/Dashboard.css";
import "./styles/global.css";
const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/questions">Questions</Link>
          <Link to="/students">Students</Link>
          <Link to="/access-codes">Access Codes</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/questions" element={<QuestionManager />} />
          <Route path="/students" element={<StudentManager />} />
          <Route path="/access-codes" element={<AccessCodeManager />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
