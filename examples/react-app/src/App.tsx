import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Logo } from "./pages/Logo";
import { Home } from "./pages/Home";

declare global {
  interface Window {
    globalStr: string;
    microApp: any;
  }
}

function App() {
  window.addEventListener("click", () => {
    console.log("react Listener!!");
    window.globalStr = "react";
  });

  if (window.microApp) {
    window.microApp.dispatch({ data: "haha" });

    window.microApp.addDataListener((v: any) => console.log("子接收到", v));
  }
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/logo" element={<Logo />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
