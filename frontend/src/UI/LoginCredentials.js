import { useEffect, useState } from "react";
import { getAdminToken, getAuthToken } from "../util/auth";
import "./LoginCredentials.css";

const LoginCredentials = (props) => {
  const [message, setMessage] = useState(null);
  const token = getAuthToken();
  const admin = getAdminToken();
  const currentRoute = window.location.pathname;

  const clickHandler = () => {
    setMessage("Loading...");
    if (currentRoute === "/login") {
      setTimeout(() => {
        if (!token && !admin) {
          setMessage("Invalid user credentials for login!");
        } else {
          setMessage(null);
        }
      }, 1000);
    }

    if (currentRoute === "/signup") {
      setTimeout(() => {
        setMessage("Invalid user credentials for signup!");
      }, 1000);
    }
  };

  useEffect(() => {
    clickHandler();
  }, [props.submitted === true]);

  return <p className="invalid-login"> {message} </p>;
};

export default LoginCredentials;
