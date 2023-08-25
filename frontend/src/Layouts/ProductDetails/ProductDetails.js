import React, { useState, useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import "./ProductDetails.css";
import { bearerFetch } from "../../util/BearerFatch";
import ProductInformation from "./components/ProductInformation";
import ReviewCheck from "./components/ReviewCheck";
import { getAuthToken } from "../../util/auth";

const ProductDetails = () => {
  const params = useParams();
  const data = useLoaderData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchProductData = () => {
      setSelectedItem(data.products.find((item) => item.id === +params.id));
      if (data.reviewsData !== undefined) {
        const reviewed = data.reviewsData.reviews.filter(
          (item) => item.id === +params.id
        );
        if (reviewed) {
          setReviews(reviewed);
        }
        return null;
      }
    };
    fetchProductData();
  }, []);

  if (!selectedItem) {
    return <div> Problem loading data </div>;
  }

  const ratingHandler = () => {
    setShow(!show);
  };

  return (
    <div className="component-wrapper">
      <ProductInformation
        item={selectedItem}
        reviews={reviews}
        ratingHandler={ratingHandler}
      />
      {show && <ReviewCheck reviews={reviews} params={params.id} />}
    </div>
  );
};

export default ProductDetails;

export const detailLoader = async ({ params }) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`http://localhost:8080/`);
    const responseData = await response.json();

    if (token) {
      const responseRev = await bearerFetch(
        `http://localhost:8080/product/review/${params.id}`
      );
      if (responseRev.ok) {
        const responseRevData = await responseRev.json();
        return {
          products: responseData,
          reviewsData: responseRevData,
        };
      }
    }
    return {
      products: responseData,
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
};
