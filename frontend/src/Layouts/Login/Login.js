import { Link, Form, redirect, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Card from "../../UI/Card";
import InputField from "../../UI/InputField";
import LoginCredentials from "../../UI/LoginCredentials";
import "../../UI/Shared.css";
import Button from "../../UI/Button";

const Login = () => {
  let [searchParams] = useSearchParams();
  const params = searchParams.get("user");
  const administrator = params === "administrator";
  const username = administrator ? "administrator" : "";
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(username);

  const nameChangeHandler = (event) => {
    setName(event.target.value);
    setSubmitted(false);
  };

  const passChangeHandler = () => {
    setSubmitted(false);
  };

  const loginHandler = () => {
    setSubmitted(true);
  };

  return (
    <div className="input">
      <Card className="form-wrapper">
        <Form method="post">
          <div>
            <label htmlFor="username">
              {administrator ? "Administrator" : "UserName"}
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
              onChange={passChangeHandler}
            />
            {submitted && <LoginCredentials submitted={submitted} />}
            <Button label="Login" onClickHandler={loginHandler} />
          </div>
          <Link to="/">
            <Button label="Back to homepage" />
          </Link>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

export async function loginAction({ request }) {
  const user = new URLSearchParams(window.location.search).get("user");
  const data = await request.formData();
  const authData = {
    user: user,
    username: data.get("username"),
    password: data.get("password"),
  };

  const hasEmptyProperty = Object.values(authData).some(
    (value) => value === ""
  );
  if (hasEmptyProperty) {
    return null;
  }

  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (!response.ok) {
    return null;
  }

  if (response.ok) {
    const resData = await response.json();
    const token = resData.token;

    if (user === "administrator") {
      localStorage.setItem("admin", token);
    } else {
      localStorage.setItem("token", token);
    }
  }

  const responseData = await fetch(
    `http://localhost:8080/login?username=${encodeURIComponent(
      authData.username
    )}`
  );
  const userData = await responseData.json();

  if (!userData[0].name && !user) {
    return redirect(
      `/loggedin?username=${encodeURIComponent(authData.username)}`
    );
  }

  return redirect("/");
}
