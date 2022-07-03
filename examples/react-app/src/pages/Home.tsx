import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>This is Home</div>
      <button
        onClick={() => {
          navigate("/logo");
        }}
      />
    </>
  );
};
