import React, { useContext, useEffect, useState } from "react";
import "./SortItem.css";
import ProductContext from "../../../Store/context";

const SortItem = (props) => {
  const prodCtx = useContext(ProductContext);
  const [selectedOption, setSelectedOption] = useState("");
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    prodCtx.sortItem(event.target.value);
  };

  useEffect(() => {
    setSelectedOption("-");
  }, [!props.categories, props.catValue]);

  return (
    <div className="sort">
      <label htmlFor="dropdown"> Sort by </label>
      <select
        className="dropdown"
        value={selectedOption}
        onChange={handleChange}
      >
        <option value=""> - </option>
        <option value="title"> Title </option>
        <option value="price"> Price (lowest first) </option>
        <option value="rating"> Rating (lowest first) </option>
      </select>
    </div>
  );
};

export default SortItem;
