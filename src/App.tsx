import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage, HomePage } from "./Screens";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>

    // <>
    //   <Header />
    //   <LandingPage />
    // </>
  );
}

export default App;
