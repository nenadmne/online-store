import { createContext } from "react";

const ProductContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  editItem: (id) => {},
  sortItem: (value) => {},
  searchItem: (value) => {},

  cart: [],
  addCartItem: (item) => {},
  removeCartItem: (id) => {},
});

export default ProductContext;
