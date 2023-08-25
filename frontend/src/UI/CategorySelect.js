import React, { Fragment } from "react";

const CategorySelect = (props) => {
  return (
    <Fragment>
      <label htmlFor="category"> Select category </label>
      <select
        className="category"
        onChange={props.change}
        value={props.selectedOption}
        name={props.name}
        required
      >
        <option>{props.selectedOption}</option>
        {[...new Set(props.items.map((item) => item.category))]
          .filter((category) => category !== props.selectedOption)
          .map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
      </select>
    </Fragment>
  );
};

export default CategorySelect;
