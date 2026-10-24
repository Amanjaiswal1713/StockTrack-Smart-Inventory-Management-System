function ProductStatus({ stock, minStock }) {
  if (stock === 0) {
    return (
      <span
        style={{
          color: "red",
        }}
      >
        Out Of Stock
      </span>
    );
  }

  if (stock <= minStock) {
    return (
      <span
        style={{
          color: "orange",
        }}
      >
        Low Stock
      </span>
    );
  }

  return (
    <span
      style={{
        color: "green",
      }}
    >
      In Stock
    </span>
  );
}

export default ProductStatus;
