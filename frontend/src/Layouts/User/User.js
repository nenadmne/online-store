import React, { useState, useEffect } from "react";
import { Link, useLoaderData, redirect, useNavigate } from "react-router-dom";
import "./User.css";
import { bearerFetch } from "../../util/BearerFatch";
import { checkResponseStatus } from "../../util/ErrorMessages";
import Card from "../../UI/Card";
import OrderedProducts from "./components/OrderedProducts.js";
import UserReview from "./components/UserReview";
import ConfirmationModal, { userAction } from "../../UI/Confirmation";
import UserInformations from "./components/UserInformations";
import PasswordInfo from "./components/PasswordInfo";
import Success from "../../UI/Success";
import Button from "../../UI/Button";

const User = () => {
  const userInformation = useLoaderData();
  const [user] = userInformation.userInfo;
  const [reviewInfo] = userInformation.reviewInfo;
  const [actionIsSuccessful, setActionIsSuccessful] = useState(false);
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  const showConfirmationHandler = () => {
    setShowConfirmation(true);
  };

  const hideConfirmationHandler = () => {
    setShowConfirmation(false);
  };

  const confirmHandler = async () => {
    userAction();
    hideConfirmationHandler();
    setActionIsSuccessful(true);
    setMessage("Succesffully deleted account!");
    setTimeout(() => {
      setActionIsSuccessful(false);
      navigate("/");
    }, 1500);
  };

  const submitHandler = async (data) => {
    const passwordData = data;
    const response = await bearerFetch("http://localhost:8080/user", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });

    if (response.ok) {
      setActionIsSuccessful(true);
      setMessage("Succesffully changed password!");
    }
    setTimeout(() => {
      setActionIsSuccessful(false);
      navigate("/user");
    }, 1500);
  };

  return (
    <div className="user-wrapper">
      {actionIsSuccessful && <Success message={message} />}

      <Card className="back-button-wrapper">
        <Link to={`/`}>
          <Button label="Back to homepage" />
        </Link>
      </Card>

      <div className="section-wrapper">
        <UserInformations show={showConfirmationHandler} userInfo={userInfo} />
        <PasswordInfo submitHandler={submitHandler} />
        <UserReview reviewInfo={reviewInfo} username={userInfo.name} />
        <OrderedProducts username={userInfo.name} />
        {showConfirmation && (
          <ConfirmationModal
            className={showConfirmation ? "shadow" : ""}
            message={`Are you sure you want to Delete your account?`}
            onCancel={hideConfirmationHandler}
            onConfirm={() => confirmHandler()}
          />
        )}
      </div>
    </div>
  );
};

export default User;

export async function userLoader() {
  try {
    const response = await bearerFetch(`http://localhost:8080/user`);
    checkResponseStatus(response);
    const userData = await response.json();
    const userInfo = userData.userInfo;

    if (userInfo === undefined) {
      return redirect(
        `/loggedin?username=${encodeURIComponent(userData.username)}`
      );
    }
    return userData;
  } catch (error) {
    console.error("Error loading user", error.message);
    throw error;
  }
}
