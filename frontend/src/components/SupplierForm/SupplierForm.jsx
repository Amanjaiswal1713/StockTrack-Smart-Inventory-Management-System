import { useEffect, useState } from "react";

import styles from "./SupplierForm.module.css";

const initialSupplier = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "Active",
};

function SupplierForm({ supplier = null, onSave, onClose }) {
  const [formData, setFormData] = useState(initialSupplier);

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(supplier?._id);

  useEffect(() => {
    if (!supplier) {
      setFormData(initialSupplier);
      return;
    }

    setFormData({
      name: supplier.name || "",

      company: supplier.company || "",

      email: supplier.email || "",

      phone: supplier.phone || "",

      status: supplier.status || "Active",
    });
  }, [supplier]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      submit: "",
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Supplier name is required.";
    }

    if (!formData.company.trim()) {
      validationErrors.company = "Company name is required.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Enter a valid email address.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const supplierData = {
      name: formData.name.trim(),

      company: formData.company.trim(),

      email: formData.email.trim().toLowerCase(),

      phone: formData.phone.trim(),

      status: formData.status,
    };

    try {
      setSubmitting(true);

      setErrors((current) => ({
        ...current,
        submit: "",
      }));

      await onSave(supplierData);

      if (!isEditing) {
        setFormData(initialSupplier);
      }

      onClose?.();
    } catch (error) {
      setErrors((current) => ({
        ...current,

        submit: error.message || "Unable to save supplier.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <label>
          <span>Contact Person</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>♣</span>

            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter supplier name"
              onChange={handleChange}
            />
          </div>

          {errors.name && <small className={styles.error}>{errors.name}</small>}
        </label>

        <label>
          <span>Company Name</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>◆</span>

            <input
              type="text"
              name="company"
              value={formData.company}
              placeholder="Enter company name"
              onChange={handleChange}
            />
          </div>

          {errors.company && (
            <small className={styles.error}>{errors.company}</small>
          )}
        </label>

        <label>
          <span>
            Email Address
            <small> Optional</small>
          </span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>✉</span>

            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="supplier@email.com"
              onChange={handleChange}
            />
          </div>

          {errors.email && (
            <small className={styles.error}>{errors.email}</small>
          )}
        </label>

        <label>
          <span>
            Phone Number
            <small> Optional</small>
          </span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>☎</span>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              placeholder="Enter phone number"
              onChange={handleChange}
            />
          </div>
        </label>

        <label className={styles.fullWidth}>
          <span>Status</span>

          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>✓</span>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </label>
      </div>

      {errors.submit && <small className={styles.error}>{errors.submit}</small>}

      <div className={styles.infoBox}>
        <span>♣</span>

        <div>
          <strong>Supplier Information</strong>

          <p>
            Products can be assigned to this supplier after the supplier is
            added.
          </p>
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={submitting}
      >
        <span>{isEditing ? "✓" : "＋"}</span>

        {submitting
          ? "Saving..."
          : isEditing
            ? "Update Supplier"
            : "Add Supplier"}
      </button>
    </form>
  );
}

export default SupplierForm;
