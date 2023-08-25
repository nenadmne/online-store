import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import "./AdminUsers.css";
import Card from "../../UI/Card";
import { checkResponseStatus } from "../../util/ErrorMessages";
import { adminFetch } from "../../util/BearerFatch";
import InputField from "../../UI/InputField";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const data = useLoaderData();

  const usersData = () => {
    const userData = data.sort((a, b) => a.username.localeCompare(b.username));
    setUsers(userData);
  };
  useEffect(() => {
    usersData();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const response = await adminFetch(`http://localhost:8080/admin/users`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      checkResponseStatus(response);
      window.location.href = "/admin/users";
    } catch (error) {
      console.error("Error deleting user", error.message);
      throw error;
    }
  };

  const changeHandler = (event) => {
    setSearch(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await adminFetch(`http://localhost:8080/admin/users`, {
        method: "POST",
        body: JSON.stringify({ search }),
      });
      checkResponseStatus(response);
      const responseData = await response.json();
      setUsers(responseData);
    } catch (error) {
      console.error("Error deleting user", error.message);
      throw error;
    }
  };

  return (
    <Card className="users-wrapper">
      <form onSubmit={submitHandler}>
        <InputField
          onChange={changeHandler}
          placeholder="Search for user"
          className="users-search-input"
        />
        <button> Search </button>
      </form>
      <table>
        <tbody>
          {users.map((item) => (
            <tr key={item.id}>
              <td>{item.username}</td>
              <td className="table-button">
                <button
                  className="cancel-button"
                  onClick={() => deleteHandler(item.id)}
                >
                  Delete User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p className="no-users"> No users found! </p>}
    </Card>
  );
};

export default AdminUsers;

export const AdminUsersLoader = async () => {
  try {
    const response = await adminFetch(`http://localhost:8080/admin/users`);
    checkResponseStatus(response);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error deleting user", error.message);
    throw error;
  }
};
