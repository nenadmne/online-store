import React from "react";
import { Link } from "react-router-dom";
import "./ProductInformation.css";
import Card from "../../../UI/Card";
import Images from "./Images";
import ProductProps from "./ProductProps";

const ProductInformation = ({ item }) => {
  const title = <span> {item.title}</span>;

  return (
    <Card className="information-wrapper">
      <div className="product">
        <Link to="/">Products</Link>
        {` > `} {item.category} {` > `}
        {title}
      </div>
      <div className="details">
        <h2>{item.description}</h2>
        <Images images={item.images} />
        <ProductProps
          item={item}
          reviews={item.reviews}
          ratingHandler={item.ratingHandler}
        />
      </div>
    </Card>
  );
};

export default ProductInformation;
