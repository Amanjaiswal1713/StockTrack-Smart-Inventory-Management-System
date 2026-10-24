import axiosInstance from "./axiosInstance";
const checkServerHealth = async () => {
  const response = await axiosInstance.get("/healthcheck");
  return response.data;
};
export { checkServerHealth };
