import React from "react";
import "./Success.css";

const Success = (props) => {
  return (
    <div className="sucess-div">
      <p> {props.message} </p>
      <p> Redirecting... </p>
    </div>
  );
};

export default Success;
