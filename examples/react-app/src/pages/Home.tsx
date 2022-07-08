import { useHistory } from "react-router-dom";
import logo from "../logo.svg";
export const Home = () => {
  const history = useHistory();
  return (
    <>
      <div>This is Home</div>
      <img src={logo} className="App-logo" alt="logo" />
      <button
        onClick={() => {
          history.push("/logo");
        }}
      />
    </>
  );
};
