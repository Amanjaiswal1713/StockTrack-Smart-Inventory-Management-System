import axiosInstance from "./axiosInstance";

const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.patch("/users/profile", profileData);
  return response.data;
};
const updateUserPreferences = async (preferences) => {
  const response = await axiosInstance.patch("/users/preferences", preferences);
  return response.data;
};
export { updateUserProfile, updateUserPreferences };
