import axiosInstance from "./axiosInstance";

const getSales = async (params = {}) => {
  const response = await axiosInstance.get("/sales", {
    params,
  });

  return response.data;
};

const getSaleById = async (saleId) => {
  const response = await axiosInstance.get(`/sales/${saleId}`);

  return response.data;
};

const createSale = async (saleData) => {
  const response = await axiosInstance.post("/sales", saleData);

  return response.data;
};

const getSalesSummary = async () => {
  const response = await axiosInstance.get("/sales/summary");

  return response.data;
};

export { getSales, getSaleById, createSale, getSalesSummary };
