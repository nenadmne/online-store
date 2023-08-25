import React from "react";
import { Link } from "react-router-dom";
import "./Payment.css";
import Card from "../../UI/Card";

const Payment = () => {
  return (
    <Card className="payment-wrapper">
      <h2> Thank you for buying our products </h2>
      <p className="tracking">
        You can track your items, during delivery, in your profile. Click
        <Link to="/user">
          <span>here</span>
        </Link>
        for automatic redirect
      </p>
      <p className="important">
        IMPORTANT: You can only carry 1 order at a time.
      </p>
    </Card>
  );
};

export default Payment;
