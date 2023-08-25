import React from "react";
import { Link } from "react-router-dom";
import Card from "../../../UI/Card";
import { getAdminToken, getAuthToken } from "../../../util/auth";
import Button from "../../../UI/Button";
import "./ProductItem.css";

const ProductItem = (props) => {
  const adminToken = getAdminToken();
  const token = getAuthToken();

  return (
    <Card className="item-wrapper">
      <div className="title-category-price">
        <div className="title-category">
          <h2> {props.item.title}</h2>
          <p>{props.item.category}</p>
        </div>
        <p className="price"> ${Number(props.item.price).toFixed(2)}</p>
        <Link to={`/product/${props.item.id}`}>
          <Button label="View Product Details" />
        </Link>
      </div>
      <div className="image-container">
        <img src={props.item.thumbnail} />
      </div>
      {adminToken ? (
        <div className="button-wrapper">
          <Link to={`/product/edit/${props.item.id}`}>
            <Button label="Edit Product Item" />
          </Link>
          <Button
            label="Delete Product"
            onClickHandler={() => props.show(props.item.id)}
          />
        </div>
      ) : token ? (
        <div className="button-wrapper">
          <Button
            label="Add to cart"
            onClickHandler={() => props.addToCart(props.item.id)}
          />
          <Link to={`/product/review/${props.item.id}`}>
            <button> Post review </button>
          </Link>
        </div>
      ) : (
        <div className="button-wrapper">
          <Link to={`/login`}>
            <Button label="Add to cart" />
          </Link>
          <Link to={`/login`}>
            <Button label="Post review" />
          </Link>
        </div>
      )}
    </Card>
  );
};

export default ProductItem;
