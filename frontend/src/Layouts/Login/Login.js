import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Card from "../../UI/Card";
import InputField from "../../UI/InputField";
import LoginCredentials from "../../UI/LoginCredentials";
import Button from "../../UI/Button";
import "../../UI/Shared.css";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const params = searchParams.get("user");
  const administrator = params === "administrator";
  const username = administrator ? "administrator" : "";

  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [name, setName] = useState(username);
  const [password, setPassword] = useState("");

  const nameChangeHandler = (event) => {
    setName(event.target.value);
    setSubmitted(false);
    setFailed(false);
  };

  const passChangeHandler = (event) => {
    setPassword(event.target.value);
    setFailed(false);
    setSubmitted(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFailed(false);

    const authData = {
      user: username,
      username: name,
      password: password,
    };

    const hasEmptyProperty = Object.values(
      authData.name || authData.password
    ).some((value) => value === "");

    if (hasEmptyProperty) {
      setFailed(true);
      return;
    }

    const response = await fetch(
      "https://online-store-full.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      }
    );

    if (!response.ok) {
      setFailed(true);
      return;
    }

    if (response.ok) {
      const resData = await response.json();
      const token = resData.token;

      if (username === "administrator") {
        localStorage.setItem("admin", token);
      } else {
        localStorage.setItem("token", token);
      }
    }

    const responseData = await fetch(
      `https://online-store-full.onrender.com/login?username=${encodeURIComponent(
        authData.username
      )}`
    );
    const userData = await responseData.json();

    if (!userData[0].name && !username) {
      return navigate(`/loggedin?username=${encodeURIComponent(name)}`);
    }

    return navigate("/");
  };

  return (
    <div className="input">
      <Card className="form-wrapper">
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="username">
              {administrator ? "Administrator" : "Username"}
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={name}
              onChange={nameChangeHandler}
            />
            <InputField
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={passChangeHandler}
            />
            {submitted && (
              <LoginCredentials submitted={submitted} failed={failed} />
            )}
            <Button type="submit" label="Login" />
          </div>
          <Link to="/">
            <Button label="Back to homepage" />
          </Link>
        </form>
      </Card>
    </div>
  );
};

export default Login;
