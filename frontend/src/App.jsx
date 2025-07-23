import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import MyProject from "./pages/MyProject";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/MyProject" element={<MyProject />} />
      </Routes>
    </Router>
  );
}

export default App;
