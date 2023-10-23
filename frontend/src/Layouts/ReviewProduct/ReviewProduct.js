import React, { Fragment, useEffect, useState } from "react";
import { useLoaderData, useParams, Form, Link, useNavigate } from "react-router-dom";
import "./ReviewProduct.css";
import Card from "../../UI/Card";
import { bearerFetch } from "../../util/BearerFatch";
import { checkResponseStatus } from "../../util/ErrorMessages";
import Success from "../../UI/Success";
import InvalidMessage from "../../UI/InvalidMessage";
import Button from "../../UI/Button";

const ReviewProduct = () => {
  const navigate = useNavigate();
  const existingReview = useLoaderData();
  const params = useParams().id;
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [actionIsSuccessful, setActionIsSuccessful] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    existingReview !== null ? existingReview.rating : "-"
  );
  const [review, setReview] = useState(
    existingReview !== null ? existingReview.review : ""
  );

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await bearerFetch(
          `https://online-store-full.onrender.com/product/review/${params}`
        );
        checkResponseStatus(response);
        const responseData = await response.json();
        setSelectedItem(responseData.item[0]);
        setActiveUser(responseData.user);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProductData();
  }, [params]);

  const reviewHandler = (event) => {
    setSelectedOption(event.target.value);
  };

  const changeRevHandler = (event) => {
    setReview(event.target.value);
  };

  const confirmHandler = () => {
    setFormIsSubmitted(true);
    if (reviewIsValid && ratingIsValid) {
      setActionIsSuccessful(true);
      setTimeout(() => {
        setActionIsSuccessful(false);
        navigate("/");
      }, 1500);
    }
  };

  const reviewIsValid = review.length > 0;
  const ratingIsValid = selectedOption !== "-";
  const invalidReviewClass = !reviewIsValid && formIsSubmitted ? "invalid" : "";
  const invalidRatingClass = !ratingIsValid && formIsSubmitted ? "invalid" : "";

  return (
    <Fragment>
      {actionIsSuccessful && <Success message="Successfully added review!" />}
      <Card className="post-review-wrapper">
        {selectedItem && (
          <>
            <Form method="POST">
              <label htmlFor="review">{`${activeUser}'s review for ${selectedItem.title}`}</label>
              <textarea
                className={invalidReviewClass}
                rows="4"
                name="review"
                type="text"
                value={review}
                onChange={changeRevHandler}
              />
              {invalidReviewClass && <InvalidMessage item="review" />}

              <select
                name="rating"
                onChange={reviewHandler}
                required
                value={selectedOption}
                className={invalidRatingClass}
              >
                <option>-</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
              {invalidRatingClass && <InvalidMessage item="rating-value" />}

              <Button
                label="Confirm"
                className="confirm-button"
                onClickHandler={confirmHandler}
              />
            </Form>
            <Link to="/">
              <Button label="Cancel" />
            </Link>
          </>
        )}
      </Card>
    </Fragment>
  );
};

export default ReviewProduct;

export async function reviewProductAction({ request, params }) {
  const id = params.id;
  const data = await request.formData();
  const review = data.get("review");
  const rating = data.get("rating");

  if (rating !== "-" && review !== "") {
    const revData = {
      review: review,
      rating: rating,
    };

    try {
      const response = await bearerFetch(
        `https://online-store-full.onrender.com/product/review/${id}`,
        {
          method: "POST",
          body: JSON.stringify(revData),
        }
      );
      checkResponseStatus(response);
    } catch (error) {
      console.error("Error updating user:", error.message);
      throw error;
    }
  }
  return null;
}

export async function reviewProductLoader({ params }) {
  const id = params.id;

  const response = await bearerFetch(
    `https://online-store-full.onrender.com/product/review/${id}`
  );
  checkResponseStatus(response);

  const responseData = await response.json();

  const [item] = responseData.reviews.filter(
    (item) => item.username == responseData.user && item.product_id === +id
  );

  if (item) {
    return {
      review: item.review,
      rating: item.reviewer_rating,
    };
  }
  return null;
}
