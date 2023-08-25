import React from "react";
import "./Timestamp.css";

const Timestamp = (props) => {
  return (
    <div className={props.className ? props.className : "time-date"}>
      <span>
        {new Date(props.time).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
      <span>
        {new Date(props.time).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
      </span>
    </div>
  );
};

export default Timestamp;
