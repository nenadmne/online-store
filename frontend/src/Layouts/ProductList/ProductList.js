import React, { Fragment, useState, useContext, useEffect } from "react";
import ProductExplorer from "./components/ProductExplorer";
import ConfirmationModal, { deleteItemAction } from "../../UI/Confirmation";
import ProductContext from "../../Store/context";
import { bearerFetch } from "../../util/BearerFatch";
import Success from "../../UI/Success";
import ProductItem from "./components/ProductItem";
import "./ProductList.css";

const image =
  "https://res.cloudinary.com/dtiuw0ams/image/upload/v1720177446/Loading_lbcxrn.png";

const ProductList = () => {
  const prodCtx = useContext(ProductContext);
  const { loaded, items, removeItem } = prodCtx;
  const loadingMessages = [
    "Connecting to server...",
    "Can take up to 2 minutes...",
  ];
  const [messageIndex, setMessageIndex] = useState(0);

  const [itemsToShow, setItemsToShow] = useState(12);
  const [loading, setLoading] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionIsSuccessful, setActionIsSuccessful] = useState(false);
  const [id, setId] = useState(null);

  const showConfirmationHandler = (itemId) => {
    setShowConfirmation(true);
    setId(itemId);
  };

  const hideConfirmationHandler = () => {
    setShowConfirmation(false);
  };

  const confirmHandler = async (itemId) => {
    try {
      await deleteItemAction(itemId);
    } catch (error) {
      console.error("Error deleting user", error.message);
      throw error;
    }

    removeItem(itemId);
    setActionIsSuccessful(true);
    hideConfirmationHandler();

    setTimeout(() => {
      setActionIsSuccessful(false);
    }, 1500);
  };

  const loadHandler = () => {
    setLoading(true);
    setTimeout(() => {
      setItemsToShow((prevItems) => prevItems + 12);
      setLoading(false);
    }, 1000);
  };

  const addToCartHandler = async (itemId) => {
    const response = await bearerFetch(
      "https://online-store-full.onrender.com/",
      {
        method: "POST",
        body: JSON.stringify({
          productId: itemId,
        }),
      }
    );
    const [responseData] = await response.json();
    prodCtx.addCartItem(responseData);
  };

  const hasMoreItemsToShow = itemsToShow < items.length;

  useEffect(() => {
    if (loaded && items.length === 0) {
      const interval = setInterval(() => {
        setMessageIndex(
          (prevIndex) => (prevIndex + 1) % loadingMessages.length
        );
      }, 3000); // Change message every 3 seconds (adjust as needed)

      return () => clearInterval(interval);
    }
  }, [loaded, items.length, loadingMessages.length]);

  return (
    <Fragment>
      {actionIsSuccessful && (
        <Success message="Successfully removed product!" />
      )}
      {!loaded && <ProductExplorer items={items} />}
      {!loaded && items.length === 0 && (
        <div className="loading">
          <p> No items found </p>
        </div>
      )}
      {!loaded && items.length !== 0 && (
        <ul className="list-wrapper">
          {items.slice(0, itemsToShow).map((item) => (
            <li key={item.id}>
              <ProductItem
                item={item}
                show={showConfirmationHandler}
                addToCart={addToCartHandler}
              />
            </li>
          ))}
        </ul>
      )}
      {loaded && items.length === 0 && (
        <div className="loading">
          <p> {loadingMessages[messageIndex]} </p>
          <p> Please wait! </p>
          <img src={image} alt="Loading image" />
        </div>
      )}
      {showConfirmation && (
        <ConfirmationModal
          message={`Are you sure you want to delete this product?`}
          onCancel={hideConfirmationHandler}
          onConfirm={() => confirmHandler(id)}
        />
      )}
      <div className="load-more-div">
        {hasMoreItemsToShow && items.length > 12 && (
          <button onClick={loadHandler}>
            {loading ? <img src={image} /> : "Load More"}
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default ProductList;
