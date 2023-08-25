import React from "react";
import "./InputField.css";

const InputField = ({
  id,
  name,
  type,
  value,
  onChange,
  required,
  disabled,
  className,
  placeholder,
}) => (
  <div className={`input-field`}>
    <label htmlFor={id}>{name}</label>
    <input
      id={id}
      name={name}
      type={type}
      onChange={onChange}
      value={value}
      required={required}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
    />
  </div>
);

export default InputField;
