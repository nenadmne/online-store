import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProductList from "./Layouts/ProductList/ProductList";
import ProductDetails, {detailLoader} from "./Layouts/ProductDetails/ProductDetails";
import ProductProvider from "./Store/contextProvider";
import EditProductInformation, {editProductAction} from "./Layouts/EditProductInfo/EditProductInformation";
import AddNewProduct from "./Layouts/AddNewProduct/AddNewProduct";
import RootLayout from "./Layouts/Root/Root";
import Login, { loginAction } from "./Layouts/Login/Login";
import SignUp, { signUpAction } from "./Layouts/Signup/SignUp";
import Loggedin,{informationAction, informationLoader} from "./Layouts/LoggedIn/Loggedin";
import User, { userLoader } from "./Layouts/User/User";
import UserEdit, {
  editAction,
  editLoader,
} from "./Layouts/UserEdit/UserEdit";
import ErrorPage from "./util/ErrorPage";
import ReviewProduct, {
  reviewProductAction,
  reviewProductLoader,
} from "./Layouts/ReviewProduct/ReviewProduct";
import Cart from "./Layouts/Cart/UserCart";
import Payment from "./Layouts/Payment/Payment";
import { categoriesLoader } from "./Layouts/ProductList/components/ProductCategories";
import AdminUsers, { AdminUsersLoader } from "./Layouts/AdminUsers/AdminUsers";
import AdminOrders, { AdminOrdersLoader } from "./Layouts/AdminOrders/AdminOrders";
import {
  addProductAction,
  editProductLoader,
  deleteItemAction,
} from "./UI/Confirmation";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      // errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <ProductList />,
          action: deleteItemAction,
          loader: categoriesLoader,
        },
        {
          path: "/product/:id",
          element: <ProductDetails />,
          loader: detailLoader,
        },
        {
          path: "/product/edit/:id",
          element: <EditProductInformation />,
          loader: editProductLoader,
          action: editProductAction,
        },
        {
          path: "/product/review/:id",
          element: <ReviewProduct />,
          action: reviewProductAction,
          loader: reviewProductLoader,
        },
        {
          path: "/product/add",
          element: <AddNewProduct />,
          action: addProductAction,
        },
        {
          path: "/loggedin",
          element: <Loggedin />,
          action: informationAction,
          loader: informationLoader,
        },
        {
          path: "/user",
          element: <User />,
          loader: userLoader,
        },
        {
          path: "/user/Edit",
          element: <UserEdit />,
          loader: editLoader,
          action: editAction,
        },
        {
          path: "/user/cart",
          element: <Cart />,
        },
        {
          path: "/user/cart/confirmed-payment",
          element: <Payment />,
        },
        {
          path: "/admin/users",
          element: <AdminUsers />,
          loader: AdminUsersLoader,
        },
        {
          path: "/admin/orders",
          element: <AdminOrders />,
          loader: AdminOrdersLoader,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      // errorElement: <ErrorPage />,
      action: loginAction,
    },
    {
      path: "/signup",
      element: <SignUp />,
      // errorElement: <ErrorPage />,
      action: signUpAction,
    },
  ]);

  return (
    <ProductProvider>
      <RouterProvider router={router} />
    </ProductProvider>
  );
}

export default App;
