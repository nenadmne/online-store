import React, { Fragment, useState } from "react";

const Select = (props) => {
  const [selectedOption, setSelectedOption] = useState(props.city);
  const changeHandler = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Fragment>
      <label htmlFor="city"> City </label>
      <select
        id="city"
        type="text"
        name="city"
        value={selectedOption}
        onChange={changeHandler}
      >
        {props.data.map((item, index) => (
          <option key={index}> {item.city}</option>
        ))}
      </select>
      <label htmlFor="country"> Country </label>
      <select id="country" type="text" name="country" required>
        <option> Montenegro </option>
      </select>
    </Fragment>
  );
};

export default Select;
