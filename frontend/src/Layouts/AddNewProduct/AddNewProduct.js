import React, { Fragment, useContext, useState } from "react";
import { useNavigate, Form } from "react-router-dom";
import "./AddNewProduct.css";
import Card from "../../UI/Card";
import useInput from "../../UI/useInput";
import ProductContext from "../../Store/context";
import ConfirmationModal, { addProductAction } from "../../UI/Confirmation";
import InputField from "../../UI/InputField";
import Success from "../../UI/Success";
import CategorySelect from "../../UI/CategorySelect";
import InvalidMessage from "../../UI/InvalidMessage";
import Button from "../../UI/Button";


const AddNewProduct = () => {
  const navigate = useNavigate();
  const prodCtx = useContext(ProductContext);
  const { addItem } = prodCtx;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);
  const [formIsCanceled, setFormIsCanceled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("-");
  const [actionIsSuccessful, setActionIsSuccessful] = useState(false);

  const {
    enteredValue: enteredTitle,
    isValid: titleIsValid,
    hasError: titleHasError,
    onChangeHandler: changeTitleHandler,
    onBlurHandler: blurTitleHandler,
  } = useInput((enteredTitle) => enteredTitle.trim().length > 0);

  const {
    enteredValue: enteredDescription,
    isValid: descriptionIsValid,
    hasError: descriptionHasError,
    onChangeHandler: changeDescriptionHandler,
    onBlurHandler: blurDescriptionHandler,
  } = useInput((enteredDescription) => enteredDescription.trim().length > 0);

  const {
    enteredValue: enteredPrice,
    isValid: priceIsValid,
    hasError: priceHasError,
    onChangeHandler: changePriceHandler,
    onBlurHandler: blurPriceHandler,
  } = useInput((enteredPrice) => enteredPrice.trim().length > 0);

  const {
    enteredValue: enteredBrand,
    isValid: brandIsValid,
    hasError: brandHasError,
    onChangeHandler: changeBrandHandler,
    onBlurHandler: blurBrandHandler,
  } = useInput((enteredBrand) => enteredBrand.trim().length > 0);

  const {
    enteredValue: enteredStock,
    isValid: stockIsValid,
    hasError: stockHasError,
    onChangeHandler: changeStockHandler,
    onBlurHandler: blurStockHandler,
  } = useInput((enteredStock) => enteredStock.trim().length > 0);

  const {
    enteredValue: enteredDiscount,
    isValid: discountIsValid,
    hasError: discountHasError,
    onChangeHandler: changeDiscountHandler,
    onBlurHandler: blurDiscountHandler,
  } = useInput((enteredDiscount) => enteredDiscount.trim().length > 0);

  const {
    enteredValue: enteredThumbnail,
    isValid: thumbnailIsValid,
    hasError: thumbnailHasError,
    onChangeHandler: changeThumbnailHandler,
    onBlurHandler: blurThumbnailHandler,
  } = useInput((enteredThumbnail) => enteredThumbnail.trim().includes("@"));

  const {
    enteredValue: enteredImages,
    isValid: imagesIsValid,
    hasError: imagesHasError,
    onChangeHandler: changeImagesHandler,
    onBlurHandler: blurImagesHandler,
  } = useInput((enteredImages) => enteredImages.trim().includes("@"));

  const validationCheck =
    titleIsValid &&
    descriptionIsValid &&
    priceIsValid &&
    brandIsValid &&
    stockIsValid &&
    discountIsValid &&
    thumbnailIsValid &&
    imagesIsValid;

  const categoryChangeHandler = (event) => {
    setSelectedOption(event.target.value);
  };

  const showConfirmationHandler = () => {
    if (validationCheck) {
      if (selectedOption === "-") {
        alert("Please select a category before submitting!");
        return;
      }
      setShowConfirmation(true);
    }
    setFormIsCanceled(true);
    setFormIsSubmitted(true);
  };

  const hideConfirmationHandler = () => {
    setShowConfirmation(false);
  };

  const confirmHandler = async () => {
    try {
      const newItemData = {
        title: enteredTitle,
        description: enteredDescription,
        price: enteredPrice,
        discount: enteredDiscount,
        category: selectedOption,
        brand: enteredBrand,
        stock: enteredStock,
        thumbnail: enteredThumbnail,
        images: JSON.stringify([enteredImages]),
      };

      const [responseItem] = await addProductAction(newItemData);
      addItem(responseItem);
      setFormIsCanceled(false);
      setFormIsSubmitted(false);
      setActionIsSuccessful(true);
      hideConfirmationHandler();
      setTimeout(() => {
        setActionIsSuccessful(false);
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const cancelHandler = () => {
    setActionIsSuccessful(false);
    setFormIsCanceled(false);
    navigate("/");
  };

  const inputInfo = [
    { hasError: titleHasError, isValid: titleIsValid },
    { hasError: descriptionHasError, isValid: descriptionIsValid },
    { hasError: priceHasError, isValid: priceIsValid },
    { hasError: discountHasError, isValid: discountIsValid },
    { hasError: brandHasError, isValid: brandIsValid },
    { hasError: stockHasError, isValid: stockIsValid },
    { hasError: thumbnailHasError, isValid: thumbnailIsValid },
    { hasError: imagesHasError, isValid: imagesIsValid },
  ];

  const invalidClass = inputInfo.map(({ hasError, isValid }) =>
    hasError || (!isValid && formIsSubmitted && formIsCanceled) ? "invalid" : ""
  );

  return (
    <Fragment>
      {actionIsSuccessful && <Success message={`Successfully added product`} />}
      <Card className="add-item-wrapper">
        <Form method="POST">
          <div className="add-item">
            <InputField
              className={invalidClass[0]}
              name="title"
              type="text"
              onChange={changeTitleHandler}
              onBlur={blurTitleHandler}
              value={enteredTitle}
            />
            {invalidClass[0] && <InvalidMessage item="title" />}

            <label htmlFor="description"> Description </label>
            <textarea
              rows="4"
              className={invalidClass[1]}
              name="description"
              type="text"
              onChange={changeDescriptionHandler}
              onBlur={blurDescriptionHandler}
              value={enteredDescription}
            />
            {invalidClass[1] && <InvalidMessage item="description" />}

            <InputField
              className={invalidClass[2]}
              name="price"
              type="number"
              onChange={changePriceHandler}
              onBlur={blurPriceHandler}
              value={enteredPrice}
              placeholder="$ 0.00"
            />
            {invalidClass[2] && <InvalidMessage item="price" />}

            <CategorySelect
              selectedOption={selectedOption}
              change={categoryChangeHandler}
              items={prodCtx.items}
            />

            <InputField name="rating" type="number" value="0" disabled />

            <InputField
              className={invalidClass[3]}
              name="discount"
              type="number"
              onChange={changeDiscountHandler}
              onBlur={blurDiscountHandler}
              value={enteredDiscount}
              required
            />
            {invalidClass[3] && <InvalidMessage item="discount" />}

            <InputField
              className={invalidClass[4]}
              name="brand"
              type="text"
              onChange={changeBrandHandler}
              onBlur={blurBrandHandler}
              value={enteredBrand}
              required
            />
            {invalidClass[4] && <InvalidMessage item="brand" />}

            <InputField
              className={invalidClass[5]}
              name="stock"
              type="text"
              onChange={changeStockHandler}
              onBlur={blurStockHandler}
              value={enteredStock}
              required
            />
            {invalidClass[5] && <InvalidMessage item="stock" />}

            <InputField
              className={invalidClass[6]}
              name="thumbnail"
              type="text"
              onChange={changeThumbnailHandler}
              onBlur={blurThumbnailHandler}
              value={enteredThumbnail}
              required
            />
            {invalidClass[6] && <InvalidMessage item="url" />}

            <InputField
              className={invalidClass[7]}
              name="images"
              type="text"
              onChange={changeImagesHandler}
              onBlur={blurImagesHandler}
              value={enteredImages}
              required
            />
            {invalidClass[7] && <InvalidMessage item="url" />}
          </div>
        </Form>
        <div className="button-div">
          <Button
            label="Submit"
            onClickHandler={showConfirmationHandler}
            className="submit-button"
          />
          <Button
            label="Cancel"
            onClickHandler={cancelHandler}
            className="cancel-button"
          />
        </div>
        {showConfirmation && (
          <ConfirmationModal
            className={showConfirmation ? "shadow" : ""}
            message={`Are you sure you want to add this product?`}
            onCancel={hideConfirmationHandler}
            onConfirm={confirmHandler}
          />
        )}
      </Card>
    </Fragment>
  );
};

export default AddNewProduct;
