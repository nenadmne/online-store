import ProductContext from "./context";
import { useEffect, useState } from "react";
import { checkResponseStatus } from "../util/ErrorMessages";
import { bearerFetch } from "../util/BearerFatch";
import { getAuthToken } from "../util/auth";

const ProductProvider = (props) => {
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [lastSortValue, setLastSortValue] = useState("");
  const token = getAuthToken();

  const fetchCartItems = async () => {
    try {
      if (token) {
        const response = await bearerFetch(
          `https://online-store-full.onrender.com/logged`
        );
        checkResponseStatus(response);
        const responseData = await response.json();
        setCartItems(responseData.products);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const fetchBoughtItems = async () => {
    try {
      if (token) {
        const response = await bearerFetch(
          `https://online-store-full.onrender.com/user/cart`
        );
        checkResponseStatus(response);
        const responseData = await response.json();
        setBoughtItems(responseData);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch(`https://online-store-full.onrender.com`);
      checkResponseStatus(response);
      const userData = await response.json();
      setSearchData(userData);
      setData(userData);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchCartItems();
    fetchBoughtItems();
  }, [token]);

  const addProductHandler = (item) => {
    const addedItem = {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      brand: item.brand,
      stock: item.stock,
      rating: item.rating,
      rating: item.rating,
      category: item.category,
      discount_percentage: item.discount_percentage,
      thumbnail: item.thumbnail,
      images: item.images,
    };
    setData([...data, addedItem]);
    fetchProductData();
  };

  const removeProductHandler = async (id) => {
    const filteredData = data.filter((item) => item.id !== id);
    setData(filteredData);
  };

  const editProductHandler = (item) => {
    const selectedItem = data.find((prod) => prod.id === +item.id);
    selectedItem.title = item.title;
    selectedItem.description = item.description;
    selectedItem.price = item.price;
    selectedItem.discount_percentage = item.discount_percentage;
    selectedItem.brand = item.brand;
    selectedItem.rating = item.rating;
    selectedItem.stock = item.stock;
    selectedItem.category = item.category;
    selectedItem.thumbnail = item.thumbnail;
    selectedItem.images = item.images;
  };

  const sortProductHandler = (value) => {
    let sortedData;
    if (isSearchPerformed) {
      if (value === "title") {
        sortedData = data
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title));
      } else if (value === "price") {
        sortedData = data.slice().sort((a, b) => a.price - b.price);
      } else if (value === "rating") {
        sortedData = data.slice().sort((a, b) => a.rating - b.rating);
      } else if (value === "") {
        sortedData = data.slice().sort((a, b) => a.id - b.id);
      }
    } else {
      if (value === "title") {
        sortedData = data
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title));
      } else if (value === "price") {
        sortedData = data.slice().sort((a, b) => a.price - b.price);
      } else if (value === "rating") {
        sortedData = data.slice().sort((a, b) => a.rating - b.rating);
      } else if (value === "") {
        sortedData = data.slice().sort((a, b) => a.id - b.id);
      }
    }
    setData(sortedData);
    setIsSearchPerformed(false);
    setLastSortValue(value);
  };

  const searchProductHandler = (value) => {
    let searchedProduct = searchData.filter((item) =>
      item.title.toLowerCase().includes(value)
    );
    if (lastSortValue === "title") {
      searchedProduct.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      searchedProduct.sort((a, b) => a[lastSortValue] - b[lastSortValue]);
    }
    setData(searchedProduct);
    setIsSearchPerformed(true);
  };

  const categoryHandler = (items) => {
    setData(items);
    setSearchData(items);
  };

  const resetHandler = () => {
    fetchProductData();
  };

  const addCartItemHandler = (item) => {
    const existingItem = cartItems.filter(
      (i) => i.product_id === item.product_id
    );

    if (existingItem.length === 0) {
      const addedItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        thumbnail: item.thumbnail,
        amount: item.amount,
        product_id: item.product_id,
      };
      setCartItems((prevCartItems) => [...prevCartItems, addedItem]);
    } else {
      const updatedCart = cartItems.map((i) =>
        i.product_id === item.product_id ? { ...i, amount: i.amount + 1 } : i
      );
      setCartItems(updatedCart);
    }
  };

  const removeCartItemHandler = (item) => {
    const existingItem = cartItems.find(
      (i) => i.product_id === item.product_id
    );
    if (existingItem.amount === 1) {
      setCartItems((prevCartItems) =>
        prevCartItems.filter((i) => i.product_id !== item.product_id)
      );
    } else {
      const updatedCart = cartItems.map((i) =>
        i.product_id === item.product_id ? { ...i, amount: i.amount - 1 } : i
      );
      setCartItems(updatedCart);
    }
  };

  const deleteCartItemsHandler = () => {
    fetchCartItems();
  };

  const addBoughtItemsHandler = (items) => {
    setBoughtItems((prevBoughtItems) => {
      const uniqueItems = items.filter(
        (item) => !prevBoughtItems.some((prevItem) => prevItem.id === item.id)
      );
      return [...prevBoughtItems, ...uniqueItems];
    });
  };

  const deleteBoughtItemsHandler = () => {
    fetchBoughtItems();
  };

  const productContext = {
    items: data,
    addItem: addProductHandler,
    removeItem: removeProductHandler,
    editItem: editProductHandler,
    sortItem: sortProductHandler,
    searchItem: searchProductHandler,
    categoryItem: categoryHandler,
    resetCategoryItem: resetHandler,

    cart: cartItems,
    addCartItem: addCartItemHandler,
    removeCartItem: removeCartItemHandler,
    deleteCartItems: deleteCartItemsHandler,

    boughtItems: boughtItems,
    addBoughtItems: addBoughtItemsHandler,
    deleteBoughtItems: deleteBoughtItemsHandler,
  };

  return (
    <ProductContext.Provider value={productContext}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
