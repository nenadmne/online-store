import React from "react";
import "./SingleReview.css";
import Timestamp from "../../../UI/TimeStamp";

const SingleReview = (props) => {
  
  return (
    <div className="reviews-wrapper">
      <div className="reviewer">
        <Timestamp time={props.time} />
        <p>
          {`( `}
          {props.item.username ? (
            <span>{props.item.username}</span>
          ) : (
            <span className="deleted-user">{` Deleted user `}</span>
          )}
          <span>{`, rating: ${props.item.reviewer_rating.toFixed(2)}): `}</span>
        </p>
      </div>
      <div className="review-wrapper">
        <p className="review"> {props.item.review}</p>
      </div>
    </div>
  );
};

export default SingleReview;
