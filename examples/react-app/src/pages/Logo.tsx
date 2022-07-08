import { useHistory } from "react-router-dom";
import logo from "../logo.svg";
export const Logo = () => {
  const history = useHistory();
  return (
    <>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={() => history.push('/')}>
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
    </>
  );
};
