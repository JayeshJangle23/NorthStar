
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

export function getErrorMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error ||
    error?.message || "Something went wrong. Please try again.";
}

export default api;
