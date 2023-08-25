import { useState } from "react";
import { Link, Form, redirect } from "react-router-dom";
import "../../UI/Shared.css";
import Card from "../../UI/Card";
import InputField from "../../UI/InputField";
import LoginCredentials from "../../UI/LoginCredentials";
import Button from "../../UI/Button";

const SignUp = () => {
  const [submitted, setSubmitted] = useState(false);

  const changeHandler = () => {
    setSubmitted(false);
  };

  const signUpHandler = () => {
    setSubmitted(true);
  };

  return (
    <div className="input">
      <Card className="form-wrapper">
        <Form method="post">
          <div>
            <InputField
              type="text"
              name="username"
              placeholder="etc. John Doe"
              onChange={changeHandler}
            />
            <InputField
              type="password"
              name="password"
              placeholder="minimum 6 characters"
              onChange={changeHandler}
            />
            <div className="checkbox">
              <input type="checkbox" name="checkbox" />
              <label htmlFor="checkbox">I agree to the Terms of Service</label>
            </div>
            {submitted && <LoginCredentials submitted={submitted} />}
            <Button onClickHandler={signUpHandler} label="Sign up" />
          </div>
          <Link to="/">
            <Button label="Back to homepage" />
          </Link>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;

export async function signUpAction({ request }) {
  const data = await request.formData();
  const authData = {
    username: data.get("username"),
    password: data.get("password"),
  };

  const hasEmptyProperty = Object.values(authData).some(
    (value) => value === ""
  );

  if (hasEmptyProperty) {
    return null;
  }

  const response = await fetch("http://localhost:8080/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (!response.ok) {
    return null;
  }
  return redirect("/");
}
