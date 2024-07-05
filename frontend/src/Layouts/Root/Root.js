import { useContext, useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  getAdminToken,
  getAuthToken,
  removeAdminToken,
  removeAuthToken,
} from "../../util/auth";
import ProductContext from "../../Store/context";
import Button from "../../UI/Button";
import "./Root.css";

const facebookImage =
  "https://res.cloudinary.com/dtiuw0ams/image/upload/v1720177446/facebook_pisihj.png";
const twitterImage =
  "https://res.cloudinary.com/dtiuw0ams/image/upload/v1720177446/twitter_mc0x0g.png";
const instagramImage =
  "https://res.cloudinary.com/dtiuw0ams/image/upload/v1720177446/instagram_vkqftd.png";
const cartImage =
  "https://res.cloudinary.com/dtiuw0ams/image/upload/v1720177446/cart_wpm33d.png";
const homeImage =
  "https://res.cloudinary.com/dtiuw0ams/image/upload/v1720177446/home_omed6c.png";

function RootLayout() {
  const token = getAuthToken();
  const adminToken = getAdminToken();

  const prodCtx = useContext(ProductContext);
  const { cart } = prodCtx;

  const amount = cart.reduce((total, item) => total + item.amount, 0);
  const [bumpCart, setBumpCart] = useState(false);

  useEffect(() => {
    setBumpCart(true);
    setTimeout(() => {
      setBumpCart(false);
    }, 200);
  }, [amount]);

  const logoutHandler = () => {
    removeAuthToken();
    removeAdminToken();
    window.location.href = "/";
  };

  const returnHandler = () => {
    window.location.href = "/";
  };

  return (
    <>
      <header className="header">
        <nav>
          {!adminToken && !token ? (
            <div className="img-div">
              <Link to="https://facebook.com" target="_blank">
                <img src={facebookImage} />
              </Link>
              <Link to="https://twitter.com" target="_blank">
                <img src={twitterImage} />
              </Link>
              <Link to="https://instagram.com" target="_blank">
                <img src={instagramImage} />
              </Link>
            </div>
          ) : (
            <div className="home-img-div">
              <Link to="/" onClick={returnHandler}>
                <img src={homeImage} />
              </Link>
            </div>
          )}
          {adminToken && (
            <div className="admin-edit-wrapper">
              <Link to="/admin/users" className="users-edit">
                Users
              </Link>
              <Link to="/admin/orders" className="users-orders">
                Orders
              </Link>
            </div>
          )}
          {!adminToken && !token && (
            <>
              <div className="admin-btn-div">
                <Link to="/login?user=administrator">
                  <Button label="Admin" />
                </Link>
              </div>
              <div className="btn-div">
                <Link to="/login">
                  <Button label="Login" />
                </Link>
                <Link to="/signup">
                  <Button label="Sign up" />
                </Link>
              </div>
            </>
          )}

          {token ? (
            <>
              <Link
                to="/user/cart"
                className={`${bumpCart ? "cart-wrapper bump" : "cart-wrapper"}`}
              >
                <img src={cartImage} />
                <p> {amount} </p>
              </Link>
              <div className="btn-div">
                <Link to="/user">
                  <Button label="My profile" />
                </Link>
                <Button label="Logout" onClickHandler={logoutHandler} />
              </div>
            </>
          ) : (
            adminToken && (
              <div className="btn-div">
                <Button label="Logout" onClickHandler={logoutHandler} />
              </div>
            )
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
}

export default RootLayout;
