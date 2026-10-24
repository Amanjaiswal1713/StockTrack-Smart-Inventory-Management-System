import { useContext, useMemo, useState } from "react";
import { DataContext } from "../../context/DataContext";
import Table from "../../components/Table/Table";
import styles from "./Inventory.module.css";

function Inventory() {
  const {
    products,
    productsLoading,
    suppliers,
    inventoryLogs,
    inventoryLoading,
    inventoryError,
    lowStockProducts,
    outOfStockProducts,
    inventoryValue,
    inventoryHealthScore,
    adjustStock,
  } = useContext(DataContext);
  const [adjustingStock, setAdjustingStock] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [stockForm, setStockForm] = useState({
    productId: "",
    quantity: "",
    type: "STOCK_IN",
  });
  const categories = useMemo(
    () => [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ],
    [products],
  );
  const totalUnits = products.reduce(
    (total, product) => total + Number(product.stock),
    0,
  );
  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search);
      const matchesCategory =
        category === "all" || product.category === category;
      const stock = Number(product.stock);
      const minimum = Number(product.minStock);
      let matchesStatus = true;
      if (status === "in-stock") {
        matchesStatus = stock > minimum;
      }
      if (status === "low-stock") {
        matchesStatus = stock > 0 && stock <= minimum;
      }
      if (status === "out-of-stock") {
        matchesStatus = stock === 0;
      }
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, query, category, status]);
  const supplierName = (product) => {
    if (product.supplier?.company) {
      return product.supplier.company;
    }

    return (
      suppliers.find(
        (supplier) => String(supplier._id) === String(product.supplierId),
      )?.company || "Not assigned"
    );
  };
  const getStatus = (product) => {
    if (Number(product.stock) === 0) {
      return {
        label: "Out of Stock",
        className: styles.outOfStock,
      };
    }
    if (Number(product.stock) <= Number(product.minStock)) {
      return {
        label: "Low Stock",
        className: styles.lowStock,
      };
    }
    return {
      label: "In Stock",
      className: styles.inStock,
    };
  };

  const handleStockSubmit = async (event) => {
    event.preventDefault();

    if (!stockForm.productId || !stockForm.quantity) {
      return;
    }

    try {
      setAdjustingStock(true);

      await adjustStock(stockForm);

      setStockForm({
        productId: "",
        quantity: "",
        type: "STOCK_IN",
      });
    } catch {
      /*
       * DataProvider displays
       * the actual API error.
       */
    } finally {
      setAdjustingStock(false);
    }
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
  };
  if (productsLoading || inventoryLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading inventory...</div>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Inventory Management</h1>

          <p>Monitor stock levels and manage inventory movements.</p>
        </div>

        <div className={styles.headerValue}>
          <span>Inventory Value</span>

          <strong>₹{inventoryValue.toLocaleString("en-IN")}</strong>
        </div>
      </header>
      {inventoryError && (
        <div className={styles.error} role="alert">
          {inventoryError}
        </div>
      )}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.productIcon}>◆</span>

          <div>
            <p>Inventory Items</p>
            <strong>{products.length}</strong>
            <small>Total products</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.unitsIcon}>▣</span>

          <div>
            <p>Stock Units</p>
            <strong>{totalUnits}</strong>
            <small>Units currently available</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.warningIcon}>△</span>

          <div>
            <p>Low Stock</p>
            <strong>{lowStockProducts.length}</strong>
            <small>Require attention</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.dangerIcon}>×</span>

          <div>
            <p>Out of Stock</p>
            <strong>{outOfStockProducts.length}</strong>
            <small>Currently unavailable</small>
          </div>
        </article>
      </section>

      <section className={styles.stockSection}>
        <div className={styles.filterCard}>
          <div className={styles.search}>
            <span>⌕</span>

            <input
              type="search"
              value={query}
              placeholder="Search inventory..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className={styles.resetButton}
          >
            ↻ Reset
          </button>
        </div>

        <form className={styles.stockForm} onSubmit={handleStockSubmit}>
          <div className={styles.stockFormHeading}>
            <div>
              <h2>Stock Adjustment</h2>

              <p>Add or remove product stock.</p>
            </div>

            <span>▣</span>
          </div>

          <select
            value={stockForm.productId}
            onChange={(event) =>
              setStockForm((current) => ({
                ...current,
                productId: event.target.value,
              }))
            }
            required
          >
            <option value="">Select product</option>

            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} ({product.stock})
              </option>
            ))}
          </select>

          <div className={styles.stockInputs}>
            <select
              value={stockForm.type}
              onChange={(event) =>
                setStockForm((current) => ({
                  ...current,
                  type: event.target.value,
                }))
              }
            >
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
            </select>

            <input
              type="number"
              min="1"
              value={stockForm.quantity}
              placeholder="Quantity"
              onChange={(event) =>
                setStockForm((current) => ({
                  ...current,
                  quantity: event.target.value,
                }))
              }
              required
            />
          </div>

          <button type="submit" disabled={adjustingStock}>
            {adjustingStock
              ? "Updating..."
              : stockForm.type === "STOCK_IN"
                ? "+ Add Stock"
                : "- Remove Stock"}
          </button>
        </form>
      </section>

      <section className={styles.tableCard}>
        <header className={styles.cardHeader}>
          <div>
            <h2>Inventory Items</h2>

            <p>
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <span className={styles.healthBadge}>
            Health Score: {inventoryHealthScore}%
          </span>
        </header>

        <Table
          columns={[
            "Product",
            "SKU",
            "Category",
            "Supplier",
            "Stock",
            "Minimum",
            "Status",
          ]}
          data={filteredProducts}
          emptyMessage="No inventory products found"
          renderRow={(product) => {
            const productStatus = getStatus(product);

            return (
              <tr key={product._id}>
                <td>
                  <div className={styles.productCell}>
                    <span>◆</span>

                    <div>
                      <strong>{product.name}</strong>
                      <small>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={styles.sku}>{product.sku}</span>
                </td>

                <td>{product.category}</td>

                <td>{supplierName(product)}</td>

                <td>
                  <strong
                    className={
                      Number(product.stock) === 0
                        ? styles.dangerStock
                        : Number(product.stock) <= Number(product.minStock)
                          ? styles.warningStock
                          : styles.goodStock
                    }
                  >
                    {product.stock}
                  </strong>
                </td>

                <td>{product.minStock}</td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${productStatus.className}`}
                  >
                    <span />
                    {productStatus.label}
                  </span>
                </td>
              </tr>
            );
          }}
        />
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.movementsCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Recent Stock Movements</h2>
              <p>Latest inventory changes</p>
            </div>
          </header>

          <div className={styles.movementList}>
            {inventoryLogs.slice(0, 5).map((log) => {
              const product = products.find(
                (item) => String(item._id) === String(log.productId),
              );

              return (
                <div className={styles.movement} key={log._id}>
                  <span
                    className={
                      log.type === "STOCK_IN"
                        ? styles.movementIn
                        : styles.movementOut
                    }
                  >
                    {log.type === "STOCK_IN" ? "↑" : "↓"}
                  </span>

                  <div>
                    <strong>{product?.name || "Deleted product"}</strong>

                    <small>{log.type.replace("_", " ")}</small>
                  </div>

                  <strong>
                    {log.type === "STOCK_IN" ? "+" : "-"}
                    {log.quantity}
                  </strong>
                </div>
              );
            })}
          </div>
        </article>

        <article className={styles.lowStockCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Low Stock Alerts</h2>
              <p>Items requiring restock</p>
            </div>
          </header>

          <div className={styles.alertList}>
            {lowStockProducts.slice(0, 5).map((product) => (
              <div className={styles.alert} key={product._id}>
                <span>△</span>

                <div>
                  <strong>{product.name}</strong>
                  <small>
                    {product.stock} remaining, minimum {product.minStock}
                  </small>
                </div>

                <em>
                  +
                  {Math.max(
                    Number(product.minStock) - Number(product.stock),
                    0,
                  )}
                </em>
              </div>
            ))}

            {lowStockProducts.length === 0 && (
              <div className={styles.emptyState}>
                <span>✓</span>
                <strong>Stock levels look good</strong>
              </div>
            )}
          </div>
        </article>

        <article className={styles.healthCard}>
          <h2>Inventory Health</h2>

          <div
            className={styles.healthCircle}
            style={{
              background: `conic-gradient(
                  #10b981 0% ${inventoryHealthScore}%,
                  #e4ede8 ${inventoryHealthScore}% 100%
                )`,
            }}
          >
            <div>
              <strong>{inventoryHealthScore}%</strong>
              <span>Health</span>
            </div>
          </div>

          <div className={styles.healthProgress}>
            <div>
              <span>Healthy Stock</span>
              <strong>
                {products.length -
                  lowStockProducts.length -
                  outOfStockProducts.length}
              </strong>
            </div>

            <div>
              <span>Low Stock</span>
              <strong>{lowStockProducts.length}</strong>
            </div>

            <div>
              <span>Out of Stock</span>
              <strong>{outOfStockProducts.length}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Inventory;
