import React, { useContext, useEffect, useState } from "react";
import Card from "../../../UI/Card";
import ProductContext from "../../../Store/context";
import Button from "../../../UI/Button";
import "./ProductCategories.css";

const ProductCategories = ({ closeHandler, changeCat, show }) => {
  const prodCtx = useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uniqueCats, setUniqueCats] = useState(null);
  const [items, setItems] = useState(null);

  const categoriesLoader = async () => {
    try {
      const response = await fetch(`https://online-store-full.onrender.com/`);
      const items = await response.json();
      const uniqueCategories = [...new Set(items.map((item) => item.category))];
      setItems(items);
      setUniqueCats(uniqueCategories);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const clickHandler = (cat) => {
    closeHandler();
    changeCat();
    setSelectedCategory(cat);
    const selectedCat = items.filter((item) => item.category === cat);
    prodCtx.categoryItem(selectedCat);
  };

  useEffect(() => {
    const swithCat = () => {
      if (show === false) {
        setSelectedCategory(null);
      }
    };
    swithCat();
  }, [show]);

  useEffect(() => {
    categoriesLoader();
  }, []);

  return (
    <Card className={`category-wrapper ${show ? "open" : "closed"}`}>
      {uniqueCats && items ? (
        uniqueCats.map((item) => (
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
        ))
      ) : (
        <p>"Please wait until server gets live!"</p>
      )}
    </Card>
  );
};

export default ProductCategories;
