import React, { useState } from "react";
import "./PasswordInfo.css";
import useInput from "../../../UI/useInput";
import Card from "../../../UI/Card";
import InputField from "../../../UI/InputField";
import Button from "../../../UI/Button";

const PasswordInfo = (props) => {
  const [passIsSubmitted, setPassIsSubmitted] = useState(false);

  const {
    enteredValue: enteredOldPass,
    onChangeHandler: oldPassHandler,
    isValid: oldPasswordIsValid,
  } = useInput((enteredOldPass) => enteredOldPass.trim().length > 5);

  const {
    enteredValue: enteredNewPass,
    onChangeHandler: newPassHandler,
    isValid: newPasswordIsValid,
  } = useInput((enteredNewPass) => enteredNewPass.trim().length > 5);

  const {
    enteredValue: enteredRepeatedPass,
    onChangeHandler: repeatedPassHandler,
    isValid: repeatedPasswordIsValid,
  } = useInput((enteredRepeatedPass) => enteredRepeatedPass.trim().length > 5);

  const data = { enteredOldPass, enteredNewPass, enteredRepeatedPass };

  const submitHandler = (event) => {
    event.preventDefault();
    setPassIsSubmitted(true);
    if (oldPasswordIsValid && newPasswordIsValid && repeatedPasswordIsValid) {
      if (enteredNewPass === enteredRepeatedPass) {
        props.submitHandler(data);
      }
    }
    setTimeout(()=>{
      setPassIsSubmitted(false)
    }, 500)
  };

  const oldPassClass = !oldPasswordIsValid && passIsSubmitted ? "invalid" : "";
  const newPassClass =
    (!newPasswordIsValid && passIsSubmitted) ||
    enteredNewPass !== enteredRepeatedPass
      ? "invalid"
      : "";
  const repeatedPassClass =
    (!newPasswordIsValid && passIsSubmitted) ||
    enteredNewPass !== enteredRepeatedPass
      ? "invalid"
      : "";

  return (
    <Card className="password-input-wrapper">
      <form method="POST" onSubmit={submitHandler}>
        <div className="password-info">
          <h2> Change your password </h2>
          <InputField
            id="oldPassword"
            type="password"
            name="oldPassword"
            value={enteredOldPass}
            onChange={oldPassHandler}
            className={oldPassClass}
          />
          {oldPassClass && (
            <p className="invalid-para">
              Minimum password length is 6 characters!
            </p>
          )}

          <InputField
            id="newPassword"
            type="password"
            name="newPassword"
            value={enteredNewPass}
            onChange={newPassHandler}
            className={newPassClass}
          />
          {newPassClass && (
            <p className="invalid-para">
              Minimum password length is 6 characters! Make sure your passwords
              matches!
            </p>
          )}

          <InputField
            id="confirmedPassword"
            type="password"
            name="confirmedPassword"
            value={enteredRepeatedPass}
            onChange={repeatedPassHandler}
            className={repeatedPassClass}
          />
          {repeatedPassClass && (
            <p className="invalid-para">
              Minimum password length is 6 characters! Make sure your passwords
              matches!
            </p>
          )}

          <Button label="Save changes" className="password-button" />
        </div>
      </form>
    </Card>
  );
};

export default PasswordInfo;
