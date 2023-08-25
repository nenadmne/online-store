import React, { useState } from "react";
import { Form, Link, redirect, useLoaderData } from "react-router-dom";
import "./Logged.css";
import Card from "../../UI/Card";
import { bearerFetch } from "../../util/BearerFatch";
import { checkResponseStatus } from "../../util/ErrorMessages";
import { getAuthToken } from "../../util/auth";
import useInput from "../../UI/useInput";
import InputField from "../../UI/InputField";
import Select from "../../UI/Select";
import Button from "../../UI/Button";

const Loggedin = () => {
  const token = getAuthToken();
  const data = useLoaderData();
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);

  const {
    enteredValue: enteredName,
    isValid: nameIsValid,
    onChangeHandler: changeNameHandler,
  } = useInput((enteredName) => enteredName.trim().length > 0);

  const {
    enteredValue: enteredAge,
    isValid: ageIsValid,
    onChangeHandler: changeAgeHandler,
  } = useInput((enteredAge) => enteredAge.trim().length > 0);

  const submitHandler = (event) => {
    event.preventDefault();
    setFormIsSubmitted(true);
  };

  const invalidNameClass = !nameIsValid && formIsSubmitted ? "invalid" : "";
  const invalidAgeClass = !ageIsValid && formIsSubmitted ? "invalid" : "";

  return (
    token && (
      <Card className="input-wrapper">
        <h2> {`Welcome!`} </h2>
        <p> Please enter your account information </p>
        <Form method="post" onSubmit={submitHandler}>
          <div>
            <InputField
              id="name"
              type="text"
              name="name"
              value={enteredName}
              onChange={changeNameHandler}
              className={invalidNameClass}
            />
            {invalidNameClass && (
              <p className="invalid-para"> Please enter a valid name! </p>
            )}

            <InputField
              id="age"
              type="number"
              name="age"
              value={enteredAge}
              onChange={changeAgeHandler}
              className={invalidAgeClass}
            />
            {invalidAgeClass && (
              <p className="invalid-para"> Please enter a valid age! </p>
            )}

            <Select data={data} />
            <Button label="Confirm" />
          </div>
          <Link to="/">
            <Button label="Back to homepage" />
          </Link>
        </Form>
      </Card>
    )
  );
};

export default Loggedin;

export async function informationAction({ request }) {
  try {
    const data = await request.formData();

    const infoData = {
      name: data.get("name"),
      age: data.get("age"),
      city: data.get("city"),
      country: data.get("country"),
    };
    const hasEmptyProperty = Object.values(infoData).some(
      (value) => value === ""
    );
    if (hasEmptyProperty) {
      return null;
    }

    const response = await bearerFetch("http://localhost:8080/logged", {
      method: "POST",
      body: JSON.stringify(infoData),
    });

    checkResponseStatus(response);

    return redirect("/user");
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
}

export async function informationLoader() {
  try {
    const response = await bearerFetch(`http://localhost:8080/logged`);
    checkResponseStatus(response);
    const responseData = await response.json();
    return responseData.cities;
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
}
