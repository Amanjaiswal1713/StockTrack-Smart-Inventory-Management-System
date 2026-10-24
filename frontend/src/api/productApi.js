import axiosInstance from "./axiosInstance";

const getProducts = async (params = {}) => {
  const response = await axiosInstance.get("/products", {
    params,
  });

  return response.data;
};

const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`);

  return response.data;
};

const createProduct = async (productData) => {
  const response = await axiosInstance.post("/products", productData);

  return response.data;
};

const updateProduct = async (productId, productData) => {
  const response = await axiosInstance.patch(
    `/products/${productId}`,
    productData,
  );

  return response.data;
};

const deleteProduct = async (productId) => {
  const response = await axiosInstance.delete(`/products/${productId}`);

  return response.data;
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
