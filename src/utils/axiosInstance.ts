import axios from "axios";

const baseUrl = process.env.BACKEND_BASE_URL;

if (!baseUrl) {
  throw new Error("BACKEND_BASE_URL is not defined.");
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(
      `${process.env.BACKEND_AUTH_USER}:${process.env.BACKEND_AUTH_PASSWORD}`
    )}`,
  },
});

export default axiosInstance;
