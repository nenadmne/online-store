import React, { useContext, useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import "./ProductExplorer.css";
import ProductContext from "../../../Store/context";
import { getAdminToken } from "../../../util/auth";
import ProductCategories from "./ProductCategories";
import SortItem from "./SortItem";
import SearchItem from "./SearchItem";
import Button from "../../../UI/Button";

const ProductExplorer = () => {
  const prodCtx = useContext(ProductContext);
  const adminToken = getAdminToken();
  const [categories, setCategories] = useState(false);
  const [reset, setReset] = useState(false);
  const [show, setShow] = useState(false);
  const [catChanged, setCatChanged] = useState(false);

  const clickHandler = () => {
    prodCtx.resetCategoryItem();
    setCategories(!categories);
    setShow(true);
    setReset(false);
  };

  const catChangeHandler = () => {
    setCatChanged(!catChanged);
  };

  useEffect(() => {
    setShow(false);
  }, []);

  const closeHandler = () => {
    setReset(true);
  };

  return (
    <Fragment>
      <div className="sort-wrapper">
        <section>
          <div className="sort-responsive">
            <SortItem categories={categories} catValue={catChanged} />
            <SearchItem />
            <div className="categories-wrapper">
              <Button
                label={reset ? "Close categories" : "Categories"}
                onClickHandler={clickHandler}
              />
            </div>
          </div>
          {adminToken && (
            <div className="add-new-item">
              <Link to="/product/add">
                <Button label="Add new item" />
              </Link>
            </div>
          )}
        </section>
      </div>
      {show && (
        <ProductCategories
          closeHandler={closeHandler}
          changeCat={catChangeHandler}
          show={categories}
        />
      )}
    </Fragment>
  );
};

export default ProductExplorer;
