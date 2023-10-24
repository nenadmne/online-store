import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import Card from "../../UI/Card";
import InputField from "../../UI/InputField";
import LoginCredentials from "../../UI/LoginCredentials";
import Button from "../../UI/Button";
import "../../UI/Shared.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [name, setName] = useState("");
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
      username: name,
      password: password,
    };

    const hasEmptyProperty = Object.values(authData).some(
      (value) => value === ""
    );

    if (hasEmptyProperty) {
      setFailed(true);
      return;
    }

    const response = await fetch(
      "ttps://online-store-full.onrender.com/signup",
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

    return navigate("/");
  };

  return (
    <div className="input">
      <Card className="form-wrapper">
        <form onSubmit={submitHandler} method="post">
          <div>
            <InputField
              type="text"
              name="username"
              placeholder="etc. John Doe"
              value={name}
              onChange={nameChangeHandler}
            />
            <InputField
              type="password"
              name="password"
              placeholder="minimum 6 characters"
              value={password}
              onChange={passChangeHandler}
            />
            <div className="checkbox">
              <input type="checkbox" name="checkbox" />
              <label htmlFor="checkbox">I agree to the Terms of Service</label>
            </div>
            {submitted && (
              <LoginCredentials failed={failed} submitted={submitted} />
            )}
            <Button type="submit" label="Sign up" />
          </div>
          <Link to="/">
            <Button label="Back to homepage" />
          </Link>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
