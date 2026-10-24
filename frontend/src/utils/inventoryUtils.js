export const calculateInventoryValue = (products = []) => {
  return products.reduce(
    (total, product) =>
      total + Number(product.stock || 0) * Number(product.price || 0),
    0,
  );
};

export const calculateTotalUnits = (products = []) => {
  return products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0,
  );
};

export const getStockStatus = (product) => {
  const stock = Number(product?.stock || 0);

  const minStock = Number(product?.minStock || 0);

  if (stock === 0) {
    return "out-of-stock";
  }

  if (stock <= minStock) {
    return "low-stock";
  }

  return "in-stock";
};

export const calculateRequiredStock = (product) => {
  return Math.max(
    Number(product?.minStock || 0) - Number(product?.stock || 0),
    0,
  );
};
