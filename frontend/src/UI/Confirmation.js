import { Form, redirect } from "react-router-dom";
import Card from "./Card";
import { adminFetch, bearerFetch } from "../util/BearerFatch";
import { checkResponseStatus } from "../util/ErrorMessages";
import { removeAuthToken } from "../util/auth";
import Button from "./Button";
import "./Confirmation.css";

const ConfirmationModal = (props) => {
  const classes = `confirmation-modal ${props.className}`;

  return (
    <div className={classes}>
      <Card className="confirmation-wrapper">
        <div className="message">{props.message}</div>
        <div className="button-container">
          <Form method="post">
            <Button
              type="button"
              label="Confirm"
              onClickHandler={props.onConfirm}
            />
          </Form>
          <Button onClickHandler={props.onCancel} label="Cancel" />
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationModal;

export async function userAction() {
  try {
    const response = await bearerFetch("ttps://online-store-full.onrender.com/user", {
      method: "DELETE",
    });
    checkResponseStatus(response);
    removeAuthToken();
    return null;
  } catch (error) {
    console.error("Error loading user", error.message);
    throw error;
  }
}

export async function deleteOrderAction(id) {
  try {
    const response = await adminFetch("ttps://online-store-full.onrender.com/admin/orders", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    checkResponseStatus(response);
    return null;
  } catch (error) {
    console.error("Error loading user", error.message);
    throw error;
  }
}

export async function postOrderAction(id) {
  try {
    const response = await adminFetch("ttps://online-store-full.onrender.com/admin/orders", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    checkResponseStatus(response);
    return null;
  } catch (error) {
    console.error("Error loading user", error.message);
    throw error;
  }
}

export async function addProductAction(item) {
  try {
    const response = await adminFetch(`ttps://online-store-full.onrender.com/product/add`, {
      method: "POST",
      body: JSON.stringify(item),
    });
    checkResponseStatus(response);
    const [responseData] = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
}

export const deleteItemAction = async (id) => {
  try {
    const response = await adminFetch(`ttps://online-store-full.onrender.com/`, {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
    });

    checkResponseStatus(response);
  } catch (error) {
    console.error("Error deleting user", error.message);
    throw error;
  }
};

export async function editProductLoader({ params }) {
  const id = params.id;
  try {
    const response = await adminFetch(
      `ttps://online-store-full.onrender.com/product/edit/${encodeURIComponent(id)}`
    );
    checkResponseStatus(response);

    const itemData = await response.json();
    if (itemData.length === 0) {
      return redirect(`/`);
    }

    return {
      id: itemData[0].id,
      title: itemData[0].title,
      description: itemData[0].description,
      price: itemData[0].price,
      discount_percentage: itemData[0].discount_percentage,
      rating: itemData[0].rating,
      brand: itemData[0].brand,
      stock: itemData[0].stock,
      category: itemData[0].category,
      thumbnail: itemData[0].thumbnail,
      images: itemData[0].images,
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
