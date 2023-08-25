import React, { useEffect, useState, Fragment, useContext } from "react";
import { useNavigate, useLoaderData, Form } from "react-router-dom";
import "./EditProductInformation.css";
import Card from "../../UI/Card";
import { adminFetch } from "../../util/BearerFatch";
import ConfirmationModal from "../../UI/Confirmation";
import ProductContext from "../../Store/context";
import { checkResponseStatus } from "../../util/ErrorMessages";
import Success from "../../UI/Success";
import InputField from "../../UI/InputField";
import CategorySelect from "../../UI/CategorySelect";
import {
  getInvalidClass,
  createChangeHandler,
} from "../../util/EditProdFunctions";
import InvalidMessage from "../../UI/InvalidMessage";
import Button from "../../UI/Button";

const EditProductInformation = () => {
  const navigate = useNavigate();
  const prodCtx = useContext(ProductContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionIsSuccessful, setActionIsSuccessful] = useState(false);
  const itemInformation = useLoaderData();
  const [itemInfo, setItemInfo] = useState(itemInformation);
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);

  useEffect(() => {
    setItemInfo(itemInformation);
  }, []);

  const titleHandler = createChangeHandler("title", setItemInfo);
  const descriptionHandler = createChangeHandler("description", setItemInfo);
  const priceHandler = createChangeHandler("price", setItemInfo);
  const discountHandler = createChangeHandler(
    "discount_percentage",
    setItemInfo
  );
  const stockHandler = createChangeHandler("stock", setItemInfo);
  const brandHandler = createChangeHandler("brand", setItemInfo);
  const categoryHandler = createChangeHandler("category", setItemInfo);
  const thumbnailHandler = createChangeHandler("thumbnail", setItemInfo);
  const imagesHandler = createChangeHandler("images", setItemInfo);

  const invalidTitleClass = getInvalidClass(itemInfo.title, formIsSubmitted);
  const invalidDescriptionClass = getInvalidClass(
    itemInfo.description,
    formIsSubmitted
  );
  const invalidPriceClass = getInvalidClass(itemInfo.price, formIsSubmitted);
  const invalidStockClass = getInvalidClass(itemInfo.stock, formIsSubmitted);
  const invalidBrandClass = getInvalidClass(itemInfo.brand, formIsSubmitted);
  const invalidImagesClass = getInvalidClass(itemInfo.images, formIsSubmitted);
  const invalidThumbnailClass = getInvalidClass(
    itemInfo.thumbnail,
    formIsSubmitted
  );
  const invalidDiscountClass = getInvalidClass(
    itemInfo.discount_percentage,
    formIsSubmitted
  );

  const showConfirmationHandler = async () => {
    setFormIsSubmitted(true);
    if (Object.values(itemInfo).some((value) => value === "")) {
      return null;
    } else {
      setShowConfirmation(true);
    }
  };

  const hideConfirmationHandler = () => {
    setShowConfirmation(false);
  };

  const confirmHandler = async () => {
    prodCtx.editItem(itemInfo);
    hideConfirmationHandler();
    setActionIsSuccessful(true);
    setFormIsSubmitted(false);
    setTimeout(() => {
      setActionIsSuccessful(false);
      navigate("/");
    }, 1500);
  };

  const cancelHandler = () => {
    navigate("/");
  };

  return (
    <Fragment>
      {actionIsSuccessful && (
        <Success message={`Successfully eddited product!`} />
      )}

      <Card className="edit-information-wrapper">
        <Form method="POST">
          <div className="edit-information-div">
            <InputField
              name="title"
              type="text"
              onChange={titleHandler}
              value={itemInfo.title}
              className={invalidTitleClass}
            />
            {invalidTitleClass && <InvalidMessage item="title" />}

            <label htmlFor="description"> Description </label>
            <textarea
              rows="4"
              name="description"
              type="text"
              onChange={descriptionHandler}
              value={itemInfo.description}
            />
            {invalidDescriptionClass && <InvalidMessage item="description" />}
            <InputField
              name="price"
              type="number"
              onChange={priceHandler}
              value={itemInfo.price}
            />
            {invalidPriceClass && <InvalidMessage item="price" />}

            <InputField
              name="discount"
              type="text"
              onChange={discountHandler}
              value={itemInfo.discount_percentage}
            />
            {invalidDiscountClass && <InvalidMessage item="discount" />}

            <InputField
              name="rating"
              type="text"
              value={itemInfo.rating}
              disabled
            />

            <InputField
              name="stock"
              type="text"
              onChange={stockHandler}
              value={itemInfo.stock}
            />
            {invalidStockClass && <InvalidMessage item="stock" />}

            <InputField
              name="brand"
              type="text"
              onChange={brandHandler}
              value={itemInfo.brand}
            />
            {invalidBrandClass && <InvalidMessage item="brand" />}

            <CategorySelect
              name="category"
              selectedOption={itemInfo.category}
              change={categoryHandler}
              items={prodCtx.items}
            />
            <InputField
              name="thumbnail"
              type="text"
              onChange={thumbnailHandler}
              value={itemInfo.thumbnail}
            />
            {invalidThumbnailClass && <InvalidMessage item="url" />}

            <InputField
              name="images"
              type="text"
              onChange={imagesHandler}
              value={itemInfo.images}
            />
            {invalidImagesClass && <InvalidMessage item="url" />}
          </div>

          <div className="button-div">
            <Button
              label="Submit"
              onClickHandler={showConfirmationHandler}
              className="submit-button"
            />
          </div>
        </Form>
        <div className="button-div">
          <Button
            label="Cancel"
            onClickHandler={cancelHandler}
            className="cancel-button"
          />
        </div>

        {showConfirmation && (
          <ConfirmationModal
            className={showConfirmation ? "shadow" : ""}
            message={`Are you sure you want to Edit this product?`}
            onCancel={hideConfirmationHandler}
            onConfirm={() => confirmHandler()}
          />
        )}
      </Card>
    </Fragment>
  );
};

export default EditProductInformation;

export async function editProductAction({ request, params }) {
  try {
    const id = params.id;
    const data = await request.formData();

    const editedData = {
      id: id,
      title: data.get("title"),
      description: data.get("description"),
      price: data.get("price"),
      discount_percentage: data.get("discount"),
      stock: data.get("stock"),
      brand: data.get("brand"),
      category: data.get("category"),
      thumbnail: data.get("thumbnail"),
      images: data.get("images"),
    };

    const hasEmptyProperty = Object.values(editedData).some(
      (value) => value === ""
    );
    if (hasEmptyProperty) {
      return null;
    }
    const response = await adminFetch(
      `http://localhost:8080/product/edit/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(editedData),
      }
    );

    checkResponseStatus(response);

    return null;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
}
