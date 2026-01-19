import { Routes, Route, Navigate } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
       <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
