import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../../context/DataContext";
import SupplierForm from "../../components/SupplierForm/SupplierForm";
import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";

import styles from "./Suppliers.module.css";

function Suppliers() {
  const navigate = useNavigate();

  const {
    suppliers,
    products,
    addSupplier,
    deleteSupplier,
    suppliersLoading,
    suppliersError,
  } = useContext(DataContext);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("company");

  const [showAddModal, setShowAddModal] = useState(false);

  const [deletingSupplier, setDeletingSupplier] = useState(null);

  const getSupplierProducts = (supplierId) => {
    return products.filter(
      (product) => String(product.supplierId) === String(supplierId),
    );
  };

  const filteredSuppliers = useMemo(() => {
    const searchQuery = query.trim().toLowerCase();

    const filtered = suppliers.filter((supplier) => {
      const name = supplier.name || "";
      const company = supplier.company || "";
      const email = supplier.email || "";
      const phone = supplier.phone || "";
      const status = supplier.status || "Active";

      const matchesSearch =
        !searchQuery ||
        name.toLowerCase().includes(searchQuery) ||
        company.toLowerCase().includes(searchQuery) ||
        email.toLowerCase().includes(searchQuery) ||
        phone.toLowerCase().includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === "name") {
        return (first.name || "").localeCompare(second.name || "");
      }

      if (sortBy === "products") {
        const firstProducts = getSupplierProducts(first._id).length;

        const secondProducts = getSupplierProducts(second._id).length;

        return secondProducts - firstProducts;
      }

      return (first.company || "").localeCompare(second.company || "");
    });
  }, [suppliers, products, query, statusFilter, sortBy]);

  const activeSuppliers = suppliers.filter(
    (supplier) => (supplier.status || "Active").toLowerCase() === "active",
  ).length;

  const inactiveSuppliers = suppliers.length - activeSuppliers;

  const assignedSuppliers = suppliers.filter(
    (supplier) => getSupplierProducts(supplier._id).length > 0,
  ).length;

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setSortBy("company");
  };

  const handleDeleteSupplier = async () => {
    if (!deletingSupplier) {
      return;
    }

    try {
      await deleteSupplier(deletingSupplier._id);

      setDeletingSupplier(null);
    } catch (error) {
      console.error("Unable to delete supplier:", error.message);
    }
  };
  if (suppliersLoading) {
    return <div className={styles.loading}>Loading suppliers...</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Suppliers</h1>

          <p>Manage supplier information and product relationships.</p>
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          <span>＋</span>
          Add Supplier
        </button>
      </header>
      {suppliersError && (
        <div className={styles.error} role="alert">
          {suppliersError}
        </div>
      )}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.totalIcon}>♣</span>

          <div>
            <p>Total Suppliers</p>
            <strong>{suppliers.length}</strong>
            <small>Registered suppliers</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.activeIcon}>✓</span>

          <div>
            <p>Active Suppliers</p>
            <strong>{activeSuppliers}</strong>
            <small>Currently active</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.assignedIcon}>◆</span>

          <div>
            <p>Assigned Suppliers</p>
            <strong>{assignedSuppliers}</strong>
            <small>Connected with products</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.inactiveIcon}>◷</span>

          <div>
            <p>Inactive Suppliers</p>
            <strong>{inactiveSuppliers}</strong>
            <small>Requires review</small>
          </div>
        </article>
      </section>

      <section className={styles.contentCard}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <span>⌕</span>

            <input
              type="search"
              value={query}
              placeholder="Search supplier, company, email..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="company">Company Name</option>

            <option value="name">Contact Name</option>

            <option value="products">Most Products</option>
          </select>

          <button
            type="button"
            className={styles.resetButton}
            onClick={resetFilters}
          >
            ↻ Reset
          </button>
        </div>

        <header className={styles.tableHeader}>
          <div>
            <h2>Supplier Directory</h2>

            <p>
              Showing {filteredSuppliers.length} of {suppliers.length} suppliers
            </p>
          </div>

          <span className={styles.directoryBadge}>
            <span />
            Supplier Network
          </span>
        </header>

        <Table
          columns={[
            "Supplier",
            "Company",
            "Email",
            "Phone",
            "Products",
            "Status",
            "Actions",
          ]}
          data={filteredSuppliers}
          emptyMessage="No suppliers found"
          renderRow={(supplier) => {
            const suppliedProducts = getSupplierProducts(supplier._id);

            const supplierStatus = supplier.status || "Active";

            const isActive = supplierStatus.toLowerCase() === "active";

            return (
              <tr key={supplier._id}>
                <td>
                  <div className={styles.supplierCell}>
                    <span className={styles.avatar}>
                      {supplier.name?.charAt(0)?.toUpperCase() || "S"}
                    </span>

                    <div>
                      <strong>{supplier.name}</strong>

                      <small>
                        Supplier ID: {String(supplier._id).slice(0, 8)}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <div className={styles.companyCell}>
                    <span>◆</span>

                    <strong>{supplier.company}</strong>
                  </div>
                </td>

                <td>
                  {supplier.email ? (
                    <a
                      href={`mailto:${supplier.email}`}
                      className={styles.email}
                    >
                      {supplier.email}
                    </a>
                  ) : (
                    <span>Not provided</span>
                  )}
                </td>

                <td>
                  <span className={styles.phone}>
                    {supplier.phone || "Not provided"}
                  </span>
                </td>

                <td>
                  <div className={styles.productCount}>
                    <strong>{suppliedProducts.length}</strong>

                    <span>
                      {suppliedProducts.length === 1 ? "product" : "products"}
                    </span>
                  </div>
                </td>

                <td>
                  <span
                    className={`${styles.status} ${
                      isActive ? styles.active : styles.inactive
                    }`}
                  >
                    <span />
                    {supplierStatus}
                  </span>
                </td>

                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.viewAction}
                      aria-label={`View ${supplier.company}`}
                      onClick={() => navigate(`/suppliers/${supplier._id}`)}
                    >
                      ◉
                    </button>

                    <button
                      type="button"
                      aria-label={`Delete ${supplier.company}`}
                      onClick={() => setDeletingSupplier(supplier)}
                    >
                      ♲
                    </button>
                  </div>
                </td>
              </tr>
            );
          }}
        />

        <div className={styles.tableFooter}>
          <span>Showing {filteredSuppliers.length} suppliers</span>

          <div>
            <button type="button" disabled>
              ‹
            </button>

            <button type="button" className={styles.activePage}>
              1
            </button>

            <button type="button" disabled>
              ›
            </button>
          </div>
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.relationshipCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Supplier Relationships</h2>

              <p>Product assignments by supplier</p>
            </div>
          </header>

          <div className={styles.relationshipList}>
            {suppliers.slice(0, 5).map((supplier) => {
              const count = getSupplierProducts(supplier._id).length;

              const percentage =
                products.length > 0 ? (count / products.length) * 100 : 0;

              return (
                <div className={styles.relationship} key={supplier._id}>
                  <span className={styles.smallAvatar}>
                    {supplier.company?.charAt(0)?.toUpperCase() || "S"}
                  </span>

                  <div className={styles.relationshipInfo}>
                    <strong>{supplier.company}</strong>

                    <small>{supplier.name}</small>
                  </div>

                  <div className={styles.progress}>
                    <span
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <strong className={styles.count}>{count}</strong>
                </div>
              );
            })}
          </div>
        </article>

        <article className={styles.contactCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Supplier Contacts</h2>

              <p>Quick contact information</p>
            </div>
          </header>

          <div className={styles.contactList}>
            {suppliers.slice(0, 4).map((supplier) => (
              <div className={styles.contactItem} key={supplier._id}>
                <span>♣</span>

                <div>
                  <strong>{supplier.name}</strong>

                  <small>{supplier.company}</small>
                </div>

                {supplier.email ? (
                  <a href={`mailto:${supplier.email}`}>✉</a>
                ) : (
                  <button type="button" disabled aria-label="Email unavailable">
                    ✉
                  </button>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className={styles.summaryCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Network Summary</h2>

              <p>Supplier coverage</p>
            </div>
          </header>

          <div className={styles.summaryCircle}>
            <div>
              <strong>{suppliers.length}</strong>

              <span>Suppliers</span>
            </div>
          </div>

          <div className={styles.summaryDetails}>
            <div>
              <span>Active</span>
              <strong>{activeSuppliers}</strong>
            </div>

            <div>
              <span>Assigned</span>
              <strong>{assignedSuppliers}</strong>
            </div>

            <div>
              <span>Products</span>
              <strong>{products.length}</strong>
            </div>
          </div>
        </article>
      </section>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className={styles.formModal}>
          <header>
            <span>♣</span>

            <div>
              <h2>Add New Supplier</h2>

              <p>Enter supplier information below.</p>
            </div>
          </header>

          <SupplierForm
            onSave={addSupplier}
            onClose={() => setShowAddModal(false)}
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(deletingSupplier)}
        onClose={() => setDeletingSupplier(null)}
      >
        <div className={styles.deleteModal}>
          <span className={styles.deleteIcon}>♲</span>

          <h2>Delete Supplier?</h2>

          <p>
            Are you sure you want to delete{" "}
            <strong>{deletingSupplier?.company}</strong>?
          </p>

          <p>
            A supplier assigned to a product cannot be deleted until the product
            is reassigned.
          </p>

          <div>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setDeletingSupplier(null)}
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleDeleteSupplier}
            >
              Delete Supplier
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Suppliers;
