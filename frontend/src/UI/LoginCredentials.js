import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./LoginCredentials.css";

const LoginCredentials = (props) => {
  const [message, setMessage] = useState(null);
  const location = useLocation();
  const clickHandler = () => {
    setMessage("Loading...");
    setTimeout(() => {
      if (props.failed === true) {
        if (location.pathname === "/login") {
          setMessage("Invalid user credentials for login!");
        } else if (location.pathname === "/signup") {
          setMessage("Invalid user credentials for sign up!");
        }
      }
    }, 300);
  };

  console.log(props.failed)
  useEffect(() => {
    setMessage(null)
    if (props.submitted === true) {
      clickHandler();
    }
  }, [props.submitted, props.failed]);

  return <p className="invalid-login"> {message} </p>;
};

export default LoginCredentials;
