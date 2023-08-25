import React, { useState, useEffect, Fragment } from "react";
import {
  Form,
  Link,
  useLoaderData,
  redirect,
  useNavigate,
} from "react-router-dom";
import "./UserEdit.css";
import { bearerFetch } from "../../util/BearerFatch";
import { checkResponseStatus } from "../../util/ErrorMessages";
import Card from "../../UI/Card";
import ConfirmationModal from "../../UI/Confirmation";
import Success from "../../UI/Success";
import InputField from "../../UI/InputField";
import Select from "../../UI/Select";
import InvalidMessage from "../../UI/InvalidMessage";
import Button from "../../UI/Button";

const UserEdit = () => {
  const navigate = useNavigate();
  const userInformation = useLoaderData();
  const user = userInformation.user[0];
  const cities = userInformation.cities;

  const [actionIsSuccessful, setActionIsSuccessful] = useState(false);
  const [userInfo, setUserInfo] = useState(user);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setUserInfo(user);
  }, [userInformation]);

  const nameHandler = (event) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      name: event.target.value,
    }));
  };

  const ageHandler = (event) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      age: event.target.value,
    }));
  };

  const invalidNameClass =
    userInfo.name.toString().trim().length === 0 ? "invalid" : "";
  const invalidAgeClass =
    userInfo.age.toString().trim().length === 0 ? "invalid" : "";

  const showConfirmationHandler = () => {
    if (!invalidNameClass && !invalidAgeClass) {
      setShowConfirmation(true);
    }
  };

  const hideConfirmationHandler = () => {
    setShowConfirmation(false);
  };

  const confirmHandler = () => {
    setActionIsSuccessful(true);
    hideConfirmationHandler();
    setTimeout(() => {
      setActionIsSuccessful(false);
      navigate("/user");
    }, 1000);
  };

  return (
    <Fragment>
      {actionIsSuccessful && (
        <Success message={`Successfully edited account!`} />
      )}

      <Card className="edit-wrapper">
        <Form method="POST">
          <InputField
            type="text"
            name="name"
            value={userInfo.name}
            onChange={nameHandler}
            className={invalidNameClass}
            required
          />
          {invalidNameClass && <InvalidMessage item="name" />}
          <InputField
            type="number"
            name="age"
            value={userInfo.age}
            onChange={ageHandler}
            className={invalidAgeClass}
            required
          />
          {invalidAgeClass && <InvalidMessage item="age" />}

          <Select data={cities} city={user.city} />

          <div className="buttons">
            <Button label="Confirm" onClickHandler={showConfirmationHandler} />
            <Link to="/user">
              <Button label="Cancel" />
            </Link>
          </div>
        </Form>
      </Card>

      {showConfirmation && (
        <ConfirmationModal
          className={showConfirmation ? "shadow" : ""}
          message={`Are you sure you want to Edit your account informations?`}
          onCancel={hideConfirmationHandler}
          onConfirm={() => confirmHandler()}
        />
      )}
    </Fragment>
  );
};

export default UserEdit;

export async function editLoader() {
  try {
    const response = await bearerFetch(`http://localhost:8080/user/edit`);
    checkResponseStatus(response);
    const data = await response.json();

    if (data.user.length === 0) {
      return redirect(`/loggedin`);
    }

    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function editAction({ request }) {
  try {
    const data = await request.formData();
    const authData = {
      name: data.get("name"),
      age: data.get("age"),
      city: data.get("city"),
      country: data.get("country"),
    };

    const response = await bearerFetch("http://localhost:8080/user/edit", {
      method: "PUT",
      body: JSON.stringify(authData),
    });
    checkResponseStatus(response);

    return null;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
}
