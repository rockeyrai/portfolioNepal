import axios from "axios";
import { store } from "../redux/store";
import Config from "react-native-config";

const api = axios.create({
  baseURL: `${Config.API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    Permission: `${Config.API_PERMISSION}`,
  },
});

// Inject token automatically
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.token?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("API Response Error:", error.response);
    } else if (error.request) {
      console.log("API No Response:", error.request);
    } else {
      console.log("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
