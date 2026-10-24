export function validateProduct(product) {
    const errors = {};
    if (!product.name?.trim()) {
        errors.name = "Product name is required";
    }
    if (!product.sku?.trim()) {
        errors.sku = "SKU is required";
    }
    if (!product.category?.trim()) {
        errors.category = "Category is required";
    }
    if (Number(product.price) <= 0) {
        errors.price = "Price must be greater than zero";
    }
    if (Number(product.stock) < 0) {
        errors.stock = "Stock cannot be negative";
    }
    if (Number(product.minStock) < 0) {
        errors.minStock = "Minimum stock cannot be negative";
    }
    return errors;
}
