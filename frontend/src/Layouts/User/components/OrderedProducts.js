import React, { useContext, useEffect, useState } from "react";
import Card from "../../../UI/Card";
import ProductContext from "../../../Store/context";
import { checkResponseStatus } from "../../../util/ErrorMessages";
import { bearerFetch } from "../../../util/BearerFatch";
import Timestamp from "../../../UI/TimeStamp";
import BoughtProducts from "./BoughtProducts";
import Button from "../../../UI/Button";
import "./OrderedProducts.css";

const OrderedProducts = (props) => {
  const prodCtx = useContext(ProductContext);
  const { boughtItems, deleteBoughtItems} = prodCtx;
  const [order, setOrder] = useState();

  const orderedProductsLoader = async () => {
    const response = await bearerFetch(
      "ttps://online-store-full.onrender.com/user/cart/confirmed-payment"
    );
    checkResponseStatus(response);
    const responseData = await response.json();
    setOrder(responseData);
  };

  useEffect(() => {
    orderedProductsLoader();
  }, []);

  const cancelHandler = async () => {
    await bearerFetch(
      "ttps://online-store-full.onrender.com/user/cart/confirmed-payment",
      {
        method: "DELETE",
      }
    );
    deleteBoughtItems();
  };

  console.log(boughtItems)
  return (
    <div className="user-order-wrapper">
      <Card className="confirmed-wrapper">
        {order !== undefined && order.length > 0 && (
          <div className="confirmed-products">
            <h2> {props.username}'s confirmed orders </h2>
            <Timestamp className="confirmed-time" time={order[0].time} />
            <div className="confirmed-info">
              <p>Order approved by administrator</p>
              <span>
                $
                {order
                  .reduce((sum, item) => sum + item.amount * item.price, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2> {props.username}'s pending order </h2>
        {boughtItems.length > 0 && <p className="pending-mssg">(pending)</p>}
        {boughtItems.map((item, index) => (
          <BoughtProducts item={item} key={index} />
        ))}
        {boughtItems.length > 0 ? (
          <Button onClickHandler={() => cancelHandler()} label="Cancel order" />
        ) : (
          <p className="notice-message"> You have not ordered anything yet </p>
        )}
      </Card>
    </div>
  );
};

export default OrderedProducts;
