import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://glovesapi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
