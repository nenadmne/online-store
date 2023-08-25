import { useNavigate, useRouteError } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from "../UI/Card";

function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  const [title, setTitle] = useState("Something went wrong");
  const [message, setMessage] = useState("Could not load page");

  useEffect(() => {
    if (error.status === 401) {
      setTitle("Not authorized!");
      setMessage("Redirecting you to log-in page...");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
      }, 2000);
    } else if (error.status === 404) {
      setTitle("Page not found!");
      setMessage("Could not find resource or page. Redirecting to homepage...");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
      }, 2000);
    } else if (error.status === 500) {
      setTitle("Server error");
      setMessage("We are doing our best to fix the issue...");
    } else {
      title = "Network Error";
      message = "An error occurred while fetching data.";
    }
  }, [error, navigate]);

  return (
    <Card className="wrapper">
      <h1>{title}</h1>
      <p>{message}</p>
    </Card>
  );
}

export default ErrorPage;
