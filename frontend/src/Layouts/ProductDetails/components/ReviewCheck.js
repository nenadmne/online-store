import React from "react";
import { Link } from "react-router-dom";
import "./ReviewCheck.css";
import Card from "../../../UI/Card";
import SingleReview from "./SingleReview";
import Button from "../../../UI/Button";

const ReviewCheck = (props) => {
  return (
    <Card className="reviews-div">
      <h2 className="reviews-header"> Customers reviews </h2>
      {props.reviews &&
        props.reviews.map((item, index) => (
          <SingleReview time={item.time} item={item} key={index} />
        ))}
      <div className="add-rev-button-div">
        <Link to={`/product/review/${props.params}`}>
          <Button label="Add review" />
        </Link>
      </div>
    </Card>
  );
};

export default ReviewCheck;
