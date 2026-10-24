import axiosInstance from "./axiosInstance";

const getSuppliers = async (params = {}) => {
  const response = await axiosInstance.get("/suppliers", {
    params,
  });

  return response.data;
};

const getSupplierById = async (supplierId) => {
  const response = await axiosInstance.get(`/suppliers/${supplierId}`);

  return response.data;
};

const createSupplier = async (supplierData) => {
  const response = await axiosInstance.post("/suppliers", supplierData);

  return response.data;
};

const updateSupplier = async (supplierId, supplierData) => {
  const response = await axiosInstance.patch(
    `/suppliers/${supplierId}`,
    supplierData,
  );

  return response.data;
};

const deleteSupplier = async (supplierId) => {
  const response = await axiosInstance.delete(`/suppliers/${supplierId}`);

  return response.data;
};

export {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
