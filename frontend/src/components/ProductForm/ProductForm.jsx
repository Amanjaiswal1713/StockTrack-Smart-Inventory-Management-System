import { useEffect, useState } from "react";
import { validateProduct } from "../../utils/validation";
import styles from "./ProductForm.module.css";

const blankProduct = {
  name: "",
  sku: "",
  category: "",
  supplierId: "",
  price: "",
  stock: "",
  minStock: "",
};

function ProductForm({ product, suppliers = [], onSubmit, onCancel }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(blankProduct);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!product) {
      setForm({
        ...blankProduct,
      });

      setErrors({});

      return;
    }

    setForm({
      name: product.name || "",

      sku: product.sku || "",

      category: product.category || "",

      supplierId: product.supplierId || product.supplier?._id || "",

      price: product.price ?? "",

      stock: product.stock ?? "",

      minStock: product.minStock ?? "",
    });

    setErrors({});
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateProduct(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }

    try {
      setSubmitting(true);

      setErrors((current) => ({
        ...current,
        submit: "",
      }));

      await onSubmit(form);

      if (!product) {
        setForm({
          ...blankProduct,
        });
      }
    } catch (error) {
      setErrors((current) => ({
        ...current,

        submit: error.message || "Unable to save product.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <span className={styles.headerIcon}>◆</span>

        <div>
          <h2>{product ? "Edit Product" : "Add New Product"}</h2>

          <p>
            {product
              ? "Update your product information."
              : "Enter the product information below."}
          </p>
        </div>
      </header>

      <div className={styles.formGrid}>
        <label className={styles.fullWidth}>
          <span>Product Name</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>◆</span>

            <input
              name="name"
              value={form.name}
              placeholder="Enter product name"
              onChange={handleChange}
            />
          </div>

          {errors.name && <small className={styles.error}>{errors.name}</small>}
        </label>

        <label>
          <span>SKU</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>#</span>

            <input
              name="sku"
              value={form.sku}
              placeholder="Example: PRD-001"
              onChange={handleChange}
            />
          </div>

          {errors.sku && <small className={styles.error}>{errors.sku}</small>}
        </label>

        <label>
          <span>Category</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>▦</span>

            <input
              name="category"
              value={form.category}
              placeholder="Enter category"
              onChange={handleChange}
            />
          </div>

          {errors.category && (
            <small className={styles.error}>{errors.category}</small>
          )}
        </label>

        <label className={styles.fullWidth}>
          <span>Supplier</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>♣</span>

            <select
              name="supplierId"
              value={form.supplierId ?? ""}
              onChange={handleChange}
            >
              <option value="">No supplier</option>

              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.company}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label>
          <span>Price</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>₹</span>

            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              placeholder="0.00"
              onChange={handleChange}
            />
          </div>

          {errors.price && (
            <small className={styles.error}>{errors.price}</small>
          )}
        </label>

        <label>
          <span>Current Stock</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>▣</span>

            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              placeholder="0"
              onChange={handleChange}
              disabled={Boolean(product)}
            />
          </div>

          {errors.stock && (
            <small className={styles.error}>{errors.stock}</small>
          )}
        </label>

        <label className={styles.fullWidth}>
          <span>Minimum Stock Level</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>△</span>

            <input
              name="minStock"
              type="number"
              min="0"
              value={form.minStock}
              placeholder="Enter minimum stock level"
              onChange={handleChange}
            />
          </div>

          {errors.minStock && (
            <small className={styles.error}>{errors.minStock}</small>
          )}
        </label>
      </div>

      <div className={styles.infoBox}>
        <span>▣</span>

        <p>
          Minimum stock is used to identify products that require restocking.
        </p>
      </div>

      {errors.submit && (
        <small className={styles.error} role="alert">
          {errors.submit}
        </small>
      )}
      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting}
        >
          <span>{product ? "✓" : "＋"}</span>

          {submitting ? "Saving..." : product ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
