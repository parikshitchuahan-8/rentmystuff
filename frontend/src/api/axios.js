import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

//  
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Keep response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = "Something went wrong") {
  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData?.errors) {
    const firstError = Object.values(responseData.errors)[0];
    if (firstError) {
      return firstError;
    }
  }

  if (responseData?.message) {
    return responseData.message;
  }

  return fallback;
}

export default api;
