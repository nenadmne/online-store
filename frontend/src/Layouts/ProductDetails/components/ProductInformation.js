import React from "react";
import { Link } from "react-router-dom";
import "./ProductInformation.css";
import Card from "../../../UI/Card";
import Images from "./Images";
import ProductProps from "./ProductProps";

const ProductInformation = (props) => {
  const title = <span> {props.item.title}</span>;

  return (
    <Card className="information-wrapper">
      <div className="product">
        <Link to="/">Products</Link>
        {` > `} {props.item.category} {` > `}
        {title}
      </div>
      <div className="details">
        <h2>{props.item.description}</h2>
        <Images images={props.item.images} />
        <ProductProps
          item={props.item}
          reviews={props.reviews}
          ratingHandler={props.ratingHandler}
        />
      </div>
    </Card>
  );
};

export default ProductInformation;
