// src/axios.js
import axios from "axios";
import { LocalStorage } from "quasar";

const apiUrl = process.env.ETRACS_API;
//  || "http://localhost:8001"; // default if not set

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ this allows cookies (sessions) to be sent automatically
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized — user may need to log in again.");
      // Optionally redirect to login page here
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// // Add a request interceptor
// instance.interceptors.request.use(
//   (config) => {
//     const token = LocalStorage.getItem("token");
//     const apiUrl = LocalStorage.getItem("API_URL") || "http://localhost:8001"; // default in case API_URL is not set

//     config.baseURL = apiUrl;
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default instance;
