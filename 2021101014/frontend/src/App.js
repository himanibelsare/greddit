import SignIn from "./SignIn";
import SignUp from "./SignUp";

import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("token", "");
    } else if (token) {
      navigate("/profile");
    }
  }, []);

  const [SignUpFlag, setSignUpFlag] = useState(true);

  if (SignUpFlag) return <SignUp setSignUpFlag={setSignUpFlag} />;
  else return <SignIn setSignUpFlag={setSignUpFlag} />;
}

export default App;
