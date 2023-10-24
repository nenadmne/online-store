import React, { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import "./ProductCategories.css";
import Card from "../../../UI/Card";
import ProductContext from "../../../Store/context";
import Button from "../../../UI/Button";

const ProductCategories = (props) => {
  const prodCtx = useContext(ProductContext);
  const cats = useLoaderData();
  const items = cats.items;
  const [selectedCategory, setSelectedCategory] = useState(null);

  const clickHandler = (cat) => {
    props.closeHandler();
    props.changeCat();
    setSelectedCategory(cat);
    const selectedCat = items.filter((item) => item.category === cat);
    prodCtx.categoryItem(selectedCat);
  };

  useEffect(() => {
    const swithCat = () => {
      if (props.show === false) {
        setSelectedCategory(null);
      }
    };
    swithCat();
  }, [props.show]);

  return (
    <Card className={`category-wrapper ${props.show ? "open" : "closed"}`}>
      {cats.uniqueCategories.map((item) => (
        <Button
          label={item}
          key={item}
          onClickHandler={() => clickHandler(item)}
          className={
            selectedCategory === item
              ? "selected-category"
              : "not-selected-category"
          }
        />
      ))}
    </Card>
  );
};

export default ProductCategories;

export async function categoriesLoader() {
  try {
    const response = await fetch(`https://online-store-full.onrender.com/`);
    const items = await response.json();
    const uniqueCategories = [...new Set(items.map((item) => item.category))];
    return { uniqueCategories, items };
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}
