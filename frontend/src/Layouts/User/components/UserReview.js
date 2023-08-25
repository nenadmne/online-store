import React from "react";
import { Link } from "react-router-dom";
import "./UserReview.css";
import Card from "../../../UI/Card";
import Timestamp from "../../../UI/TimeStamp";

const UserReview = (props) => {
  return (
    <Card className="user-review-wrapper">
      <h2> {props.username}'s reviews</h2>
      {props.reviewInfo.length > 0 ? (
        props.reviewInfo.map((item, index) => (
          <div key={index} className="user-review">
            <div className="left-review-side">
              {item.review} ({item.reviewer_rating})
              <Timestamp className="inherit" time={item.time} />
            </div>
            <Link
              to={`/product/${item.product_id}`}
              className="user-review-image"
            >
              <img src={item.thumbnail} />
            </Link>
          </div>
        ))
      ) : (
        <p className="notice-message"> You have not reviewed any item yet </p>
      )}
    </Card>
  );
};

export default UserReview;
