import React, { Fragment, useState } from "react";
import { useLoaderData } from "react-router-dom";
import "./AdminOrders.css";
import Card from "../../UI/Card";
import { checkResponseStatus } from "../../util/ErrorMessages";
import { adminFetch } from "../../util/BearerFatch";
import ConfirmationModal from "../../UI/Confirmation";
import { deleteOrderAction, postOrderAction } from "../../UI/Confirmation";
import Button from "../../UI/Button";
import Success from "../../UI/Success";

const AdminOrders = () => {
  const data = useLoaderData();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [message, setMessage] = useState(null);

  const itemsByUserId = data.reduce((map, item) => {
    const { user_id } = item;
    if (!map[user_id]) {
      map[user_id] = [];
    }
    map[user_id].push(item);
    return map;
  }, {});

  const idConfirmationHandler = (user_id) => {
    setShowConfirmation(true);
    setSelectedUserId(user_id);
  };

  const usernameConfirmationHandler = (username) => {
    setShowConfirmation(true);
    setSelectedUsername(username);
  };

  const hideConfirmationHandler = () => {
    setShowConfirmation(false);
  };

  const confirmHandler = () => {
    if (selectedUserId !== null) {
      deleteOrderAction(selectedUserId);
      setMessage("Successfully deleted order");
    } else if (selectedUsername !== null) {
      postOrderAction(selectedUsername);
      setMessage("Successfully confirmed order");
    }

    hideConfirmationHandler();
    setSelectedUsername(null);
    setSelectedUserId(null);
    setShowConfirmation(false);

    setTimeout(() => {
      setMessage(null);
      window.location.href = "/admin/orders";
    }, 1500);
  };

  return (
    <Fragment>
      {message && <Success message={message} />}
      <Card className="orders-wrapper">
        {Object.values(itemsByUserId).map((userItems, userIndex) => (
          <ul key={userIndex}>
            <div className="username-number-div">
              <p>{userItems[0].username}</p>
            </div>
            {userItems.map((item, itemIndex) => (
              <li key={itemIndex}>
                <div className="order-info">
                  <h2>{item.title}</h2>
                  <div className="price-amount">
                    <p>${item.price}</p>
                    <p>x{item.amount}</p>
                  </div>
                </div>
              </li>
            ))}
            <div className="order-button-div">
              <Button
                label="Accept"
                onClickHandler={() =>
                  usernameConfirmationHandler(userItems[0].user_id)
                }
                className="submit-button"
              />
              <Button
                label="Decline"
                onClickHandler={() =>
                  idConfirmationHandler(userItems[0].user_id)
                }
                className="cancel-button"
              />
            </div>
          </ul>
        ))}
        {showConfirmation && (
          <ConfirmationModal
            className={showConfirmation ? "shadow" : ""}
            message="Are you sure you want to perform this action?"
            onCancel={hideConfirmationHandler}
            onConfirm={confirmHandler}
          />
        )}
      </Card>
    </Fragment>
  );
};

export default AdminOrders;

export const AdminOrdersLoader = async () => {
  try {
    const response = await adminFetch(
      `ttps://online-store-full.onrender.com/admin/orders`
    );
    checkResponseStatus(response);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error deleting user", error.message);
    throw error;
  }
};
