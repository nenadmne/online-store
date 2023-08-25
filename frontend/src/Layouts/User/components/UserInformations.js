import React from "react";
import { Link } from "react-router-dom";
import "./UserInformations.css";
import Card from "../../../UI/Card";
import Button from "../../../UI/Button";

const UserInformations = (props) => {
  return (
    <Card className="account-info">
      <h2> Account informations </h2>
      {props.userInfo && (
        <ul>
          <li>
            name: <span>{props.userInfo.name}</span>
          </li>
          <li>
            age: <span>{props.userInfo.age}</span>
          </li>
          <li>
            city: <span>{props.userInfo.city}</span>
          </li>
          <li>
            country: <span>{props.userInfo.country}</span>
          </li>
        </ul>
      )}
      <div className="btns">
        <Link to={`/user/edit?username=${props.userInfo.username}`}>
          <Button label="Edit" />
        </Link>
        <Button label="Delete my account" onClickHandler={() => props.show()} />
      </div>
    </Card>
  );
};

export default UserInformations;
