import axiosInstance from "./axiosInstance";

const getReorderPlans = async (params = {}) => {
  const response = await axiosInstance.get("/reorders", {
    params,
  });

  return response.data;
};

const getReorderPlanById = async (reorderId) => {
  const response = await axiosInstance.get(`/reorders/${reorderId}`);

  return response.data;
};

const createReorderPlan = async (planData = {}) => {
  const response = await axiosInstance.post("/reorders", planData);

  return response.data;
};

const updateReorderPlan = async (reorderId, updates) => {
  const response = await axiosInstance.patch(`/reorders/${reorderId}`, updates);

  return response.data;
};

const deleteReorderPlan = async (reorderId) => {
  const response = await axiosInstance.delete(`/reorders/${reorderId}`);

  return response.data;
};

export {
  getReorderPlans,
  getReorderPlanById,
  createReorderPlan,
  updateReorderPlan,
  deleteReorderPlan,
};
