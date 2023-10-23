import {
  Link,
  Form,
  useSearchParams,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../../UI/Card";
import InputField from "../../UI/InputField";
import LoginCredentials from "../../UI/LoginCredentials";
import "../../UI/Shared.css";
import Button from "../../UI/Button";

const Login = () => {
  const [searchParams] = useSearchParams();
  const params = searchParams.get("user");
  const navigate = useNavigate();
  const administrator = params === "administrator";
  const username = administrator ? "administrator" : "";
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(null);
  const [name, setName] = useState(username);

  const data = useActionData();

  const nameChangeHandler = (event) => {
    setName(event.target.value);
    setSubmitted(false);
  };

  const passChangeHandler = () => {
    setSubmitted(false);
  };

  useEffect(() => {
    if (data === false) {
      setValid(false);
    } else if (data === "redirect to loggedin") {
      setValid(true);
      navigate(`/loggedin?username=${encodeURIComponent(authData.username)}`);
    } else if (data === "redirect to homepage") {
      setValid(true);
      navigate(`/`);
    } else {
      setValid(null)
    }
  }, [data]);

  const clickHandler = () => {
    setValid(null)
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
            {submitted && (
              <LoginCredentials valid={valid} submitted={submitted} />
            )}
            <Button label="Login" onClickHandler={clickHandler} />
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
    return false;
  }

  const response = await fetch("https://online-store-full.onrender.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (!response.ok) {
    return false;
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
    `https://online-store-full.onrender.com/login?username=${encodeURIComponent(
      authData.username
    )}`
  );
  const userData = await responseData.json();

  if (!userData[0].name && !user) {
    return "redirect to loggedin";
  }

  return "redirect to homepage";
}
