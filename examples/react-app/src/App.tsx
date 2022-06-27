import React from "react";
import logo from "./logo.svg";
import "./App.css";

declare global {
  interface Window {
    globalStr: string;
  }
}

function App() {
  window.addEventListener("click", () => {
    console.log("react Listener!!");
    window.globalStr = "react";
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
