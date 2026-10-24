import axiosInstance from "./axiosInstance";

const getInventoryTransactions = async (params = {}) => {
  const response = await axiosInstance.get("/inventory/transactions", {
    params,
  });

  return response.data;
};

const getProductInventoryHistory = async (productId) => {
  const response = await axiosInstance.get(
    `/inventory/products/${productId}/history`,
  );

  return response.data;
};

const adjustInventoryStock = async ({
  productId,
  quantity,
  type,
  note = "",
}) => {
  const response = await axiosInstance.post("/inventory/adjust", {
    productId,
    quantity,
    type,
    note,
  });

  return response.data;
};

export {
  getInventoryTransactions,
  getProductInventoryHistory,
  adjustInventoryStock,
};
