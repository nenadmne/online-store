import { useEffect, useState } from "react";
import "./LoginCredentials.css";

const LoginCredentials = (props) => {
  const [message, setMessage] = useState(null);

  const clickHandler = () => {
    setMessage("Loading...");
    setTimeout(() => {
      if (props.valid === false) {
        setMessage("Invalid user credentials for login!");
      }
    }, 300);
  };

  console.log(props.valid);
  useEffect(() => {
    if (props.submitted === true) {
      clickHandler();
    }
  }, [props.submitted, props.valid]);

  return <p className="invalid-login"> {message} </p>;
};

export default LoginCredentials;
