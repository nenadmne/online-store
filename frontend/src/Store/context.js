import { createContext } from "react";

const ProductContext = createContext({
  loaded: false,
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  editItem: (id) => {},
  sortItem: (value) => {},
  searchItem: (value) => {},
  categoryItem: (value) => {},
  resetCategoryItem: () => {},

  cart: [],
  addCartItem: (item) => {},
  removeCartItem: (id) => {},

  boughtItems: [],
  addBoughtItems: (value) => {},
  deleteBoughtItems: (value) => {},
});

export default ProductContext;
