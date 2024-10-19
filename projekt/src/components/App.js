import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../styles/App.scss";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* Header będzie wyświetlany na każdej podstronie */}
        <main>
          <Routes></Routes>
        </main>
        <Footer /> {/* Footer będzie wyświetlany na każdej podstronie */}
      </div>
    </Router>
  );
}

export default App;
