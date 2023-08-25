import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserCart.css";
import ProductContext from "../../Store/context";
import { bearerFetch } from "../../util/BearerFatch";
import { checkResponseStatus } from "../../util/ErrorMessages";
import ConfirmationModal from "../../UI/Confirmation";
import CartItem from "./components/CartItem";
import CartPrice from "./components/CartPrice";

const UserCart = () => {
  const prodCtx = useContext(ProductContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { cart } = prodCtx;

  const navigate = useNavigate();

  const showConfirmationHandler = async () => {
    setShowConfirmation(true);
  };

  const hideConfirmationHandler = () => {
    setShowConfirmation(false);
  };

  const payHandler = async () => {
    const response = await bearerFetch("http://localhost:8080/user/cart");
    checkResponseStatus(response);
    const responseData = await response.json();
    prodCtx.addBoughtItems(responseData);

    await bearerFetch("http://localhost:8080/user/cart", {
      method: "DELETE",
    });
    prodCtx.deleteCartItems();
    navigate("/user/cart/confirmed-payment");
  };

  return (
    <div className="cart-items-wrapper">
      {cart.map((item, index) => (
        <CartItem key={index} item={item} />
      ))}
      <CartPrice show={showConfirmationHandler} />
      {showConfirmation && (
        <ConfirmationModal
          className={showConfirmation ? "shadow" : ""}
          message={`Are you sure you want to purchase selected item/s?`}
          onCancel={hideConfirmationHandler}
          onConfirm={() => payHandler()}
        />
      )}
    </div>
  );
};

export default UserCart;
