import { getAdminToken, getAuthToken } from "./auth";

export async function bearerFetch(url, options = {}) {
  const token = getAuthToken();

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  return await fetch(url, {
    ...options,
    headers,
  });
}

export async function adminFetch(url, options = {}) {
  const token = getAdminToken();

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  return await fetch(url, {
    ...options,
    headers,
  });
}
