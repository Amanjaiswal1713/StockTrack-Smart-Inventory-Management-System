import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DataContext } from "../../context/DataContext";
import Table from "../../components/Table/Table";
import styles from "./LowStock.module.css";

function LowStock() {
  const navigate = useNavigate();
  const {
    products,
    lowStockProducts,
    outOfStockProducts,
    suppliers,
    inventoryLogs,
    adjustStock,
    createReorderPlan,
    reorderLoading,
  } = useContext(DataContext);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [sortBy, setSortBy] = useState("stock-low");
  const [restockingProductId, setRestockingProductId] = useState(null);
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
  const createReorderList = async () => {
    if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
      toast.info("No products currently require reordering.");

      return;
    }

    try {
      const plan = await createReorderPlan({
        note: "Created from Low Stock page",
      });

      toast.success(`Reorder plan created for ${plan.items.length} products.`);
    } catch {
      // DataProvider already
      // surfaces API errors.
    }
  };
  const categories = useMemo(() => {
    return [
      ...new Set(
        lowStockProducts.map((product) => product.category).filter(Boolean),
      ),
    ];
  }, [lowStockProducts]);

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

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = lowStockProducts.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name?.toLowerCase().includes(normalizedQuery) ||
        product.sku?.toLowerCase().includes(normalizedQuery) ||
        product.category?.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesSupplier =
        supplierFilter === "all" ||
        String(product.supplierId) === String(supplierFilter);

      return matchesQuery && matchesCategory && matchesSupplier;
    });

    return [...result].sort((first, second) => {
      if (sortBy === "stock-low") {
        return Number(first.stock) - Number(second.stock);
      }

      if (sortBy === "stock-high") {
        return Number(second.stock) - Number(first.stock);
      }

      if (sortBy === "name") {
        return first.name.localeCompare(second.name);
      }

      if (sortBy === "value-high") {
        return (
          Number(second.price) * Number(second.stock) -
          Number(first.price) * Number(first.stock)
        );
      }

      return 0;
    });
  }, [lowStockProducts, query, categoryFilter, supplierFilter, sortBy]);

  const valueAtRisk = lowStockProducts.reduce(
    (total, product) => total + Number(product.price) * Number(product.stock),
    0,
  );

  const reorderUnits = lowStockProducts.reduce(
    (total, product) =>
      total + Math.max(Number(product.minStock) - Number(product.stock), 0),
    0,
  );

  const categorySummary = useMemo(() => {
    const summary = {};

    lowStockProducts.forEach((product) => {
      const category = product.category || "Other";

      if (!summary[category]) {
        summary[category] = {
          name: category,
          products: 0,
          units: 0,
        };
      }

      summary[category].products += 1;
      summary[category].units += Number(product.stock);
    });

    return Object.values(summary).sort(
      (first, second) => second.products - first.products,
    );
  }, [lowStockProducts]);

  const maximumCategoryProducts = Math.max(
    ...categorySummary.map((category) => category.products),
    1,
  );

  const recentStockUpdates = inventoryLogs
    .filter((log) => log.type === "STOCK_IN")
    .slice(0, 5);

  const productName = (log) => {
    if (log.product?.name) {
      return log.product.name;
    }

    return (
      products.find((product) => String(product._id) === String(log.productId))
        ?.name || "Inventory item"
    );
  };

  const resetFilters = () => {
    setQuery("");
    setCategoryFilter("all");
    setSupplierFilter("all");
    setSortBy("stock-low");
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Low Stock Items</h1>

          <p>Monitor products that require immediate restocking.</p>
        </div>

        <button
          type="button"
          className={styles.reorderButton}
          onClick={createReorderList}
          disabled={reorderLoading}
        >
          <span>▣</span>
          {reorderLoading ? "Creating..." : "Create Reorder List"}
        </button>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.lowIcon}>△</span>

          <div>
            <p>Low Stock</p>

            <strong>{lowStockProducts.length}</strong>

            <small>Products below minimum stock</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.reorderIcon}>↻</span>

          <div>
            <p>Need Reorder</p>

            <strong>{reorderUnits}</strong>

            <small>Minimum units required</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.valueIcon}>₹</span>

          <div>
            <p>Value at Risk</p>

            <strong>₹{valueAtRisk.toLocaleString("en-IN")}</strong>

            <small>Current low-stock inventory value</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.outIcon}>×</span>

          <div>
            <p>Out of Stock</p>

            <strong>{outOfStockProducts.length}</strong>

            <small>Products currently unavailable</small>
          </div>
        </article>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <span>⌕</span>

            <input
              type="search"
              value={query}
              placeholder="Search product, SKU or category..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={supplierFilter}
            onChange={(event) => setSupplierFilter(event.target.value)}
          >
            <option value="all">All Suppliers</option>

            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.company}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="stock-low">Lowest Stock</option>

            <option value="stock-high">Highest Stock</option>

            <option value="name">Product Name</option>

            <option value="value-high">Highest Value</option>
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
            <h2>Products Requiring Attention</h2>

            <p>Showing {filteredProducts.length} low-stock products</p>
          </div>

          <span className={styles.alertBadge}>
            <span />
            Action Required
          </span>
        </header>

        <Table
          columns={[
            "Product",
            "SKU",
            "Category",
            "Current Stock",
            "Minimum",
            "Required",
            "Supplier",
            "Stock Level",
            "Action",
          ]}
          data={filteredProducts}
          emptyMessage="No low-stock products match the filters"
          renderRow={(product) => {
            const currentStock = Number(product.stock);
            const minimumStock = Number(product.minStock);

            const requiredQuantity = Math.max(minimumStock - currentStock, 0);

            const stockPercentage = Math.min(
              100,
              minimumStock > 0 ? (currentStock / minimumStock) * 100 : 0,
            );

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

                <td>
                  <span className={styles.category}>{product.category}</span>
                </td>

                <td>
                  <strong className={styles.currentStock}>
                    {currentStock}
                  </strong>
                </td>

                <td>{minimumStock}</td>

                <td>
                  <span className={styles.required}>+{requiredQuantity}</span>
                </td>

                <td>
                  <div className={styles.supplierCell}>
                    <span>♣</span>

                    {supplierName(product)}
                  </div>
                </td>

                <td>
                  <div className={styles.stockLevel}>
                    <div>
                      <span
                        style={{
                          width: `${stockPercentage}%`,
                        }}
                      />
                    </div>

                    <small>{Math.round(stockPercentage)}%</small>
                  </div>
                </td>

                <td>
                  <button
                    type="button"
                    className={styles.restockAction}
                    disabled={restockingProductId === product._id}
                    onClick={async () => {
                      if (requiredQuantity <= 0) {
                        toast.info("This product does not need restocking.");

                        return;
                      }

                      try {
                        setRestockingProductId(product._id);

                        await adjustStock({
                          productId: product._id,

                          quantity: requiredQuantity,

                          type: "STOCK_IN",

                          note: "Restocked from Low Stock page",
                        });
                      } catch {
                        // API error
                      } finally {
                        setRestockingProductId(null);
                      }
                    }}
                  >
                    {restockingProductId === product._id
                      ? "Restocking..."
                      : `Restock +${requiredQuantity}`}
                  </button>
                </td>
              </tr>
            );
          }}
        />

        <div className={styles.tableFooter}>
          <span>Showing {filteredProducts.length} results</span>

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
        <article className={styles.distributionCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Stock Distribution</h2>

              <p>Low-stock inventory overview</p>
            </div>
          </header>

          <div className={styles.distributionContent}>
            <div
              className={styles.donut}
              style={{
                background: `conic-gradient(
                    #f59e0b 0% ${
                      lowStockProducts.length + outOfStockProducts.length > 0
                        ? (lowStockProducts.length /
                            (lowStockProducts.length +
                              outOfStockProducts.length)) *
                          100
                        : 0
                    }%,
                    #ef4444 ${
                      lowStockProducts.length + outOfStockProducts.length > 0
                        ? (lowStockProducts.length /
                            (lowStockProducts.length +
                              outOfStockProducts.length)) *
                          100
                        : 0
                    }% 100%
                  )`,
              }}
            >
              <div>
                <strong>
                  {lowStockProducts.length + outOfStockProducts.length}
                </strong>

                <span>At Risk</span>
              </div>
            </div>

            <div className={styles.legend}>
              <div>
                <span className={styles.yellowDot} />

                <p>Low Stock</p>

                <strong>{lowStockProducts.length}</strong>
              </div>

              <div>
                <span className={styles.redDot} />

                <p>Out of Stock</p>

                <strong>{outOfStockProducts.length}</strong>
              </div>
            </div>
          </div>
        </article>

        <article className={styles.categoryCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Top Categories</h2>

              <p>Categories requiring restock</p>
            </div>
          </header>

          <div className={styles.categoryList}>
            {categorySummary.slice(0, 5).map((category, index) => (
              <div className={styles.categoryRow} key={category.name}>
                <span
                  className={
                    index % 3 === 0
                      ? styles.categoryBlue
                      : index % 3 === 1
                        ? styles.categoryGreen
                        : styles.categoryPurple
                  }
                >
                  ◆
                </span>

                <div>
                  <strong>{category.name}</strong>

                  <small>{category.products} products</small>
                </div>

                <section>
                  <div>
                    <span
                      style={{
                        width: `${
                          (category.products / maximumCategoryProducts) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <small>{category.units} units</small>
                </section>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.updatesCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Recent Stock Updates</h2>

              <p>Latest restock activity</p>
            </div>
          </header>

          <div className={styles.updateList}>
            {recentStockUpdates.length > 0 ? (
              recentStockUpdates.map((log) => (
                <div className={styles.update} key={log._id}>
                  <span>↑</span>

                  <div>
                    <strong>{productName(log)}</strong>

                    <small>
                      <small>{formatDate(log.date)}</small>
                    </small>
                  </div>

                  <em>+{log.quantity}</em>
                </div>
              ))
            ) : (
              <div className={styles.emptyUpdates}>
                <span>▣</span>

                <strong>No recent restocks</strong>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className={styles.reorderCard}>
        <div className={styles.reorderGraphic}>
          <span>▣</span>
        </div>

        <div className={styles.reorderContent}>
          <span>SMART REORDER SUGGESTION</span>

          <h2>
            Restock {reorderUnits} Units Across {lowStockProducts.length}{" "}
            Products
          </h2>

          <p>
            Reordering these units will bring every listed product back to its
            configured minimum stock level.
          </p>
        </div>

        <button type="button" onClick={() => navigate("/reorders")}>
          View Reorder Plan
          <span>→</span>
        </button>
      </section>
    </div>
  );
}

export default LowStock;
