import "./BoughtProducts.css";

const BoughtProducts = (props) => {
  return (
    <div className="bought-products">
      <div className="bought-product-info">
        <h2>{props.item.title}</h2>
      </div>
      <div className="bought-price">
        <div>
          <span className="price"> ${props.item.price} </span>
          <span> x {props.item.amount}</span>
        </div>

        <div className="bought-image">
          <img src={props.item.thumbnail} />
        </div>
      </div>
    </div>
  );
};

export default BoughtProducts;
