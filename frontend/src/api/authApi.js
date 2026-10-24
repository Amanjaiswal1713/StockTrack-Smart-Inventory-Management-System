import axiosInstance from "./axiosInstance";

const registerUser = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);

  return response.data;
};

const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);

  return response.data;
};

const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");

  return response.data;
};

const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");

  return response.data;
};

const refreshAccessToken = async () => {
  const response = await axiosInstance.post("/auth/refresh-token");

  return response.data;
};

const changePassword = async (passwordData) => {
  const response = await axiosInstance.patch(
    "/auth/change-password",
    passwordData,
  );

  return response.data;
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
};
