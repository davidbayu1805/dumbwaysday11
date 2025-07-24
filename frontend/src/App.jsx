import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import MyProject from "./pages/MyProject";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/myproject" 
          element={
            <ProtectedRoute>
              <MyProject />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;