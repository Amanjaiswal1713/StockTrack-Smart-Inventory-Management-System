import { useContext, useMemo, useState } from "react";
import { DataContext } from "../../context/DataContext";
import Modal from "../../components/Modal/Modal";
import ProductForm from "../../components/ProductForm/ProductForm";
import Table from "../../components/Table/Table";
import styles from "./Products.module.css";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();

  const {
    products,
    productsLoading,
    productsError,
    suppliers,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useContext(DataContext);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const categories = useMemo(() => {
    return [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
  }, [products]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "No date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name?.toLowerCase().includes(normalizedQuery) ||
        product.sku?.toLowerCase().includes(normalizedQuery) ||
        product.category?.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const stock = Number(product.stock);
      const minimumStock = Number(product.minStock);

      let matchesStatus = true;

      if (statusFilter === "in-stock") {
        matchesStatus = stock > minimumStock;
      }

      if (statusFilter === "low-stock") {
        matchesStatus = stock > 0 && stock <= minimumStock;
      }

      if (statusFilter === "out-of-stock") {
        matchesStatus = stock === 0;
      }

      return matchesQuery && matchesCategory && matchesStatus;
    });

    return [...result].sort((first, second) => {
      if (sortBy === "name-ascending") {
        return first.name.localeCompare(second.name);
      }

      if (sortBy === "name-descending") {
        return second.name.localeCompare(first.name);
      }

      if (sortBy === "price-low") {
        return Number(first.price) - Number(second.price);
      }

      if (sortBy === "price-high") {
        return Number(second.price) - Number(first.price);
      }

      if (sortBy === "stock-low") {
        return Number(first.stock) - Number(second.stock);
      }

      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });
  }, [products, query, categoryFilter, statusFilter, sortBy]);

  const supplierName = (product) => {
    if (product.supplier?.company) {
      return product.supplier.company;
    }

    const supplier = suppliers.find(
      (item) => String(item._id) === String(product.supplierId),
    );

    return supplier?.company || "Not assigned";
  };

  const getStatus = (product) => {
    const stock = Number(product.stock);
    const minimumStock = Number(product.minStock);

    if (stock === 0) {
      return {
        text: "Out of Stock",
        className: styles.outOfStock,
      };
    }

    if (stock <= minimumStock) {
      return {
        text: "Low Stock",
        className: styles.lowStock,
      };
    }

    return {
      text: "In Stock",
      className: styles.inStock,
    };
  };

  const inStockCount = products.filter(
    (product) => Number(product.stock) > Number(product.minStock),
  ).length;

  const lowStockCount = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= Number(product.minStock),
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock) === 0,
  ).length;

  const resetFilters = () => {
    setQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
  };
  const handleDeleteProduct = async () => {
    if (!deletingProduct) {
      return;
    }

    try {
      await deleteProduct(deletingProduct._id);

      setDeletingProduct(null);
    } catch (error) {
      console.error("Unable to delete product:", error.message);
    }
  };
  const exportProducts = () => {
    const rows = [
      [
        "Name",
        "SKU",
        "Category",
        "Supplier",
        "Price",
        "Stock",
        "Minimum Stock",
      ],

      ...filteredProducts.map((product) => [
        product.name,
        product.sku,
        product.category,
        supplierName(product),
        product.price,
        product.stock,
        product.minStock,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "");

            return `"${text.replaceAll('"', '""')}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;

    anchor.download = "stocktrack-products.csv";

    anchor.click();

    URL.revokeObjectURL(url);
  };

  if (productsLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Products</h1>

          <p>Manage your products, pricing and stock information.</p>
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          <span>＋</span>
          Add Product
        </button>
      </header>
      {productsError && (
        <div className={styles.error} role="alert">
          {productsError}
        </div>
      )}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.totalIcon}>◆</span>

          <div>
            <p>Total Products</p>
            <strong>{products.length}</strong>
            <small>All inventory products</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.stockIcon}>✓</span>

          <div>
            <p>In Stock</p>
            <strong>{inStockCount}</strong>
            <small>Products with healthy stock</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.lowIcon}>△</span>

          <div>
            <p>Low Stock</p>
            <strong>{lowStockCount}</strong>
            <small>Products requiring attention</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.outIcon}>×</span>

          <div>
            <p>Out of Stock</p>
            <strong>{outOfStockCount}</strong>
            <small>Products currently unavailable</small>
          </div>
        </article>
      </section>

      <section className={styles.contentCard}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <span>⌕</span>

            <input
              type="search"
              value={query}
              placeholder="Search by product, SKU or category..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="name-ascending">Name A-Z</option>
            <option value="name-descending">Name Z-A</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock-low">Lowest Stock</option>
          </select>

          <button
            type="button"
            className={styles.resetButton}
            onClick={resetFilters}
          >
            ↻ Reset
          </button>
        </div>

        <div className={styles.resultsHeader}>
          <div>
            <h2>Product List</h2>

            <p>
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <button
            type="button"
            className={styles.exportButton}
            onClick={exportProducts}
          >
            <span>⇩</span>
            Export
          </button>
        </div>

        <Table
          columns={[
            "Product",
            "SKU",
            "Category",
            "Supplier",
            "Price",
            "Stock",
            "Min. Stock",
            "Status",
            "Actions",
          ]}
          data={filteredProducts}
          emptyMessage="No products match your filters"
          renderRow={(product) => {
            const status = getStatus(product);

            return (
              <tr key={product._id}>
                <td>
                  <div className={styles.productCell}>
                    <span className={styles.productIcon}>◆</span>

                    <div>
                      <strong>{product.name}</strong>

                      <small>
                        Added{" "}
                        {product.createdAt
                          ? formatDate(product.createdAt)
                          : "Recently"}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={styles.sku}>{product.sku}</span>
                </td>

                <td>
                  <span className={styles.category}>{product.category}</span>
                </td>

                <td>
                  <div className={styles.supplierCell}>
                    <span>♣</span>
                    {supplierName(product)}
                  </div>
                </td>

                <td>
                  <strong className={styles.price}>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </strong>
                </td>

                <td>
                  <strong
                    className={
                      Number(product.stock) === 0
                        ? styles.stockDanger
                        : Number(product.stock) <= Number(product.minStock)
                          ? styles.stockWarning
                          : styles.stockValue
                    }
                  >
                    {product.stock}
                  </strong>
                </td>

                <td>{product.minStock}</td>

                <td>
                  <span className={`${styles.status} ${status.className}`}>
                    <span />
                    {status.text}
                  </span>
                </td>

                <td>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      className={styles.viewAction}
                      aria-label={`View ${product.name}`}
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      ◉
                    </button>

                    <button
                      type="button"
                      className={styles.editAction}
                      aria-label={`Edit ${product.name}`}
                      onClick={() => setEditingProduct(product)}
                    >
                      ✎
                    </button>

                    <button
                      type="button"
                      className={styles.deleteAction}
                      aria-label={`Delete ${product.name}`}
                      onClick={() => setDeletingProduct(product)}
                    >
                      ♲
                    </button>
                  </div>
                </td>
              </tr>
            );
          }}
        />

        <div className={styles.pagination}>
          <span>Showing {filteredProducts.length} products</span>

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

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className={styles.modalContent}>
          <ProductForm
            suppliers={suppliers}
            onSubmit={async (form) => {
              await addProduct(form);

              setShowAddModal(false);
            }}
            onCancel={() => setShowAddModal(false)}
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
      >
        <div className={styles.modalContent}>
          <ProductForm
            product={editingProduct}
            suppliers={suppliers}
            onSubmit={async (form) => {
              await updateProduct(editingProduct._id, form);

              setEditingProduct(null);
            }}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
      >
        <div className={styles.deleteModal}>
          <span className={styles.deleteModalIcon}>♲</span>

          <h2>Delete Product?</h2>

          <p>
            This will permanently delete{" "}
            <strong>{deletingProduct?.name}</strong>. This action cannot be
            undone.
          </p>

          <div className={styles.deleteModalActions}>
            <button
              type="button"
              className={styles.cancelDelete}
              onClick={() => setDeletingProduct(null)}
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.confirmDelete}
              onClick={handleDeleteProduct}
            >
              Delete Product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Products;
