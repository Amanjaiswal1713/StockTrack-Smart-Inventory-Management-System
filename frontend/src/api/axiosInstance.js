import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

let refreshPromise = null;

const normalizeApiError = (error) => {
  if (!error.response) {
    return {
      statusCode: 500,

      message:
        error.code === "ECONNABORTED"
          ? "The server request timed out"
          : "Unable to connect to the StockTrack server",

      errors: [],

      originalError: error,
    };
  }

  return {
    statusCode: error.response.status,

    message:
      error.response.data?.message ||
      "The server could not complete the request",

    errors: error.response.data?.errors || [],

    originalError: error,
  };
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;

    const isAuthenticationRequest =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh-token");

    if (
      isUnauthorized &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthenticationRequest
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(
              `${API_BASE_URL}/auth/refresh-token`,
              {},
              {
                withCredentials: true,
              },
            )
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(normalizeApiError(refreshError));
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export default axiosInstance;
