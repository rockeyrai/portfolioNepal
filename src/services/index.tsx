import { store } from "../redux/store";
import axios from "axios";

const api = axios.create({
  baseURL: 'https://api.peridot.com.np/api',
  // baseURL: "https://staging.peridot.com.np/api",
  // baseURL:"http://localhost:8080/ap",
  // baseURL: 'http://192.168.100.244:8080/api',
  headers: {
    "Content-Type": "application/json",
    Permission: "2021D@T@f@RSt6&%2-D@T@",
  },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token?.access; 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('Response error:', error.response);
    } else if (error.request) {
      console.log('Request made but no response:', error.request);
    } else {
      console.log('Axios error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;



// Mini Graph
// GET /company/chart_data/:symbol/:timestamp – Company mini graph data

// Sector Minute Data
// GET /sector/market_chart_data_minute_one_day/:sector_id – Intraday sector data



// Live Data
// GET /live_data/live – Live stock data
