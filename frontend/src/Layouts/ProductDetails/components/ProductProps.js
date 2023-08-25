import React from "react";
import "./ProductProps.css";
import StarRating from "../../../UI/StarRating";

const ProductProps = (props) => {
  return (
    <div className="product-details">
      <div className="main">
        <p className="stock">
          Available: <span>{`${props.item.stock}`}</span> pcs
        </p>
        <p>
          Price:
          <span className="price">{` $${props.item.price}`}</span>
        </p>
        <p>
          Discount:
          <span className="price">
            {`  ${props.item.discount_percentage}%`}
          </span>
        </p>
      </div>

      {props.item.rating > 0 && props.reviews && (
        <div className="rating">
          <p>{`rating: ${(
            (+props.item.rating +
              props.reviews.reduce(
                (sum, item) => sum + item.reviewer_rating,
                0
              )) /
            (props.reviews.length + 1)
          ).toFixed(2)} / 5.00`}</p>
          <StarRating rating={props.item.rating} />
          <p
            className="reviews-activator"
            onClick={() => props.ratingHandler()}
          >{`( ${props.reviews.length} )`}</p>
        </div>
      )}
    </div>
  );
};

export default ProductProps;
