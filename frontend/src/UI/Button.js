import React from "react";

const Button = ({ label, onClickHandler, className, type }) => {
  return (
    <button type={type} className={className} onClick={onClickHandler}>
      {label}
    </button>
  );
};

export default Button;
