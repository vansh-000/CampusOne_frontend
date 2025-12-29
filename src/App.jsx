import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import ContactPage from "./Pages/ContactPage";
import NotFound from "./Pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <NotFound />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
