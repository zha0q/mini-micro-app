import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  HashRouter,
} from "react-router-dom";
import { Logo } from "./pages/Logo";
import { Home } from "./pages/Home";

declare global {
  interface Window {
    globalStr: string;
    microApp: any;
  }
}

function App() {
  if (window.microApp) {
    window.microApp.dispatch({ data: "haha" });

    window.microApp.addDataListener((v: any) => console.log("子接收到", v));
  }
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route path="/logo" component={Logo} />
          <Route path="/" component={Home} />
          <Route path="/title" component={Home} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
