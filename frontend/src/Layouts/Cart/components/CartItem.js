import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Card from "../../../UI/Card";
import { checkResponseStatus } from "../../../util/ErrorMessages";
import { bearerFetch } from "../../../util/BearerFatch";
import "./CartItem.css";
import ProductContext from "../../../Store/context";
import Button from "../../../UI/Button";

const CartItem = (props) => {
  const prodCtx = useContext(ProductContext);

  const removeHandler = async (id) => {
    const response = await bearerFetch("ttps://online-store-full.onrender.com/user/cart", {
      method: "POST",
      body: JSON.stringify({ productId: id }),
    });
    checkResponseStatus(response);
    const [responseData] = await response.json();
    prodCtx.removeCartItem(responseData);
  };

  const addHandler = async (id) => {
    try {
      const response = await bearerFetch("ttps://online-store-full.onrender.com/", {
        method: "POST",
        body: JSON.stringify({ productId: id }),
      });

      if (response.ok) {
        const [responseData] = await response.json();
        prodCtx.addCartItem(responseData);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <Card className="cart-items">
      <div className="cart-detail">
        <h2>{props.item.title}</h2>
        <p>{props.item.description}</p>
        <p className="price">
          ${props.item.price} x {props.item.amount}
        </p>
      </div>
      <Link to={`/product/${props.item.product_id}`} className="cart-image">
        <img src={props.item.thumbnail} />
      </Link>
      <div className="amount-button-wrapper">
        <Button
          label="+"
          onClickHandler={() => addHandler(props.item.product_id)}
        />
        <Button
          label="-"
          onClickHandler={() => removeHandler(props.item.product_id)}
        />
      </div>
    </Card>
  );
};

export default CartItem;
