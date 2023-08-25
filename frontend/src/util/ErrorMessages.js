import { json } from "react-router-dom";

export const checkResponseStatus = (response) => {
  const ERROR_MESSAGES = {
    401: "Unauthorized",
    404: "Page not found",
    // 422: "Username taken",
    500: "Server error: Could not find page.",
  };

  const errorMessage =
    ERROR_MESSAGES[response.status] || "Unknown error occurred.";

  if (response.status === 401) {
    throw json({ message: errorMessage }, { status: 401 });
  }

  if (response.status === 404) {
    throw json({ message: errorMessage }, { status: 404 });
  }

  // if (response.status === 422) {
  //   throw json({ message: errorMessage }, { status: 422 });
  // }

  if (!response.ok) {
    throw json({ message: errorMessage }, { status: 500 });
  }
};
