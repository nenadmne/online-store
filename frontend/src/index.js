import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import ProductProvider from "./Store/contextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ProductProvider>
    <App />
  </ProductProvider>
);
