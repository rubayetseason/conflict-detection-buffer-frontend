"use client";

import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor — Attach token
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("conflict_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ Response Interceptor — Global error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.info("Server is currently down. Please try again later.");
    } else {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
