import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Card from "../../../UI/Card";
import ProductContext from "../../../Store/context";
import "./CartPrice.css";
import Button from "../../../UI/Button";

const CartPrice = (props) => {
  const prodCtx = useContext(ProductContext);
  const { cart } = prodCtx;
  const totalAmount = cart.reduce(
    (total, item) => total + item.amount * item.price,
    0
  );
  return (
    <Card>
      <div className="price-div">
        <p className="price"> Total amount:</p>
        <p className="price"> ${totalAmount.toFixed(2)}</p>
      </div>
      <div className="pay-button">
        {cart.length > 0 && (
          <Button label="Pay now" onClickHandler={() => props.show()} />
        )}
        <Link to="/">
          <Button label="cancel" />
        </Link>
      </div>
    </Card>
  );
};

export default CartPrice;
