import { useContext, useMemo, useState } from "react";
import { DataContext } from "../../context/DataContext";
import Table from "../../components/Table/Table";
import styles from "./DeadStock.module.css";
import { useNavigate } from "react-router-dom";

function DeadStock() {
  const navigate = useNavigate();
  const { deadStockProducts, deadStockLoading, deadStockError, suppliers } =
    useContext(DataContext);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [sortBy, setSortBy] = useState("inactive");

  const categories = useMemo(() => {
    return [
      ...new Set(
        deadStockProducts.map((product) => product.category).filter(Boolean),
      ),
    ];
  }, [deadStockProducts]);

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
  const getInactiveDays = (date) => {
    if (!date) {
      return null;
    }

    const difference = new Date().getTime() - new Date(date).getTime();

    return Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = deadStockProducts.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        product.name?.toLowerCase().includes(normalizedQuery) ||
        product.sku?.toLowerCase().includes(normalizedQuery) ||
        product.category?.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesSupplier =
        supplierFilter === "all" ||
        String(product.supplierId) === String(supplierFilter);

      return matchesSearch && matchesCategory && matchesSupplier;
    });

    return [...result].sort((first, second) => {
      if (sortBy === "value-high") {
        return (
          Number(second.price) * Number(second.stock) -
          Number(first.price) * Number(first.stock)
        );
      }

      if (sortBy === "stock-high") {
        return Number(second.stock) - Number(first.stock);
      }

      if (sortBy === "name") {
        return first.name.localeCompare(second.name);
      }

      return (
        (getInactiveDays(second.lastSaleDate) ?? Number.MAX_SAFE_INTEGER) -
        (getInactiveDays(first.lastSaleDate) ?? Number.MAX_SAFE_INTEGER)
      );
    });
  }, [deadStockProducts, query, categoryFilter, supplierFilter, sortBy]);

  const deadStockUnits = deadStockProducts.reduce(
    (total, product) => total + Number(product.stock),
    0,
  );

  const deadStockValue = deadStockProducts.reduce(
    (total, product) => total + Number(product.stock) * Number(product.price),
    0,
  );

  const categorySummary = useMemo(() => {
    const summary = {};

    deadStockProducts.forEach((product) => {
      const category = product.category || "Other";

      if (!summary[category]) {
        summary[category] = {
          name: category,
          products: 0,
          units: 0,
          value: 0,
        };
      }

      summary[category].products += 1;
      summary[category].units += Number(product.stock);

      summary[category].value += Number(product.stock) * Number(product.price);
    });

    return Object.values(summary).sort(
      (first, second) => second.value - first.value,
    );
  }, [deadStockProducts]);

  const maximumCategoryValue = Math.max(
    ...categorySummary.map((category) => category.value),
    1,
  );

  const resetFilters = () => {
    setQuery("");
    setCategoryFilter("all");
    setSupplierFilter("all");
    setSortBy("inactive");
  };
  if (deadStockLoading) {
    return <div className={styles.page}>Loading dead stock...</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Dead Stock</h1>

          <p>
            Identify inactive inventory and reduce unnecessary stock holding.
          </p>
        </div>

        <button
          type="button"
          className={styles.reviewButton}
          onClick={() => {
            resetFilters();

            requestAnimationFrame(() => {
              document.getElementById("dead-stock-table")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            });
          }}
        >
          <span>▤</span>
          Review Dead Stock
        </button>
      </header>
      {deadStockError && (
        <div className={styles.error} role="alert">
          {deadStockError}
        </div>
      )}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.productsIcon}>◉</span>

          <div>
            <p>Dead Stock Products</p>
            <strong>{deadStockProducts.length}</strong>
            <small>Products with low activity</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.unitsIcon}>◆</span>

          <div>
            <p>Dead Stock Units</p>
            <strong>{deadStockUnits}</strong>
            <small>Units currently held</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.valueIcon}>₹</span>

          <div>
            <p>Stock Value</p>

            <strong>₹{deadStockValue.toLocaleString("en-IN")}</strong>

            <small>Capital tied in dead stock</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.daysIcon}>◷</span>

          <div>
            <p>Inactive Period</p>
            <strong>90+</strong>
            <small>Days used for detection</small>
          </div>
        </article>
      </section>

      <section id="dead-stock-table" className={styles.tableCard}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <span>⌕</span>

            <input
              type="search"
              value={query}
              placeholder="Search dead stock..."
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
            <option value="inactive">Longest Inactive</option>

            <option value="value-high">Highest Value</option>

            <option value="stock-high">Highest Stock</option>

            <option value="name">Product Name</option>
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
            <h2>Inactive Inventory</h2>

            <p>
              Showing {filteredProducts.length} of {deadStockProducts.length}{" "}
              products
            </p>
          </div>

          <span className={styles.dangerBadge}>
            <span />
            Review Required
          </span>
        </header>

        <Table
          columns={[
            "Product",
            "SKU",
            "Category",
            "Supplier",
            "Stock",
            "Price",
            "Stock Value",
            "Last Sale",
            "Inactive",
            "Status",
          ]}
          data={filteredProducts}
          emptyMessage="No dead stock products found"
          renderRow={(product) => {
            const inactivityDate = product.lastSaleDate || product.createdAt;

            const inactiveDays = getInactiveDays(inactivityDate);
            const productValue = Number(product.stock) * Number(product.price);

            return (
              <tr key={product._id}>
                <td>
                  <div className={styles.productCell}>
                    <span>◆</span>

                    <div>
                      <strong>{product.name}</strong>

                      <small>Minimum stock: {product.minStock}</small>
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
                  <strong className={styles.stock}>{product.stock}</strong>
                </td>

                <td>₹{Number(product.price).toLocaleString("en-IN")}</td>

                <td>
                  <strong className={styles.stockValue}>
                    ₹{productValue.toLocaleString("en-IN")}
                  </strong>
                </td>

                <td>
                  {product.lastSaleDate
                    ? formatDate(product.lastSaleDate)
                    : "No sales"}
                </td>

                <td>
                  <span className={styles.inactiveDays}>
                    {inactiveDays === null
                      ? "No activity"
                      : `${inactiveDays} days`}
                  </span>
                </td>

                <td>
                  <span className={styles.deadBadge}>
                    <span />
                    Dead Stock
                  </span>
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
        <article className={styles.categoryCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Dead Stock by Category</h2>

              <p>Value distribution across categories</p>
            </div>
          </header>

          <div className={styles.categoryList}>
            {categorySummary.slice(0, 5).map((category, index) => (
              <div className={styles.categoryRow} key={category.name}>
                <span
                  className={
                    index % 3 === 0
                      ? styles.blueCategory
                      : index % 3 === 1
                        ? styles.orangeCategory
                        : styles.purpleCategory
                  }
                >
                  ◆
                </span>

                <div className={styles.categoryInfo}>
                  <strong>{category.name}</strong>

                  <small>
                    {category.products} products, {category.units} units
                  </small>
                </div>

                <section>
                  <div>
                    <span
                      style={{
                        width: `${
                          (category.value / maximumCategoryValue) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <strong>₹{category.value.toLocaleString("en-IN")}</strong>
                </section>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.recommendationCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Recommended Actions</h2>

              <p>Ways to reduce dead stock</p>
            </div>
          </header>

          <div className={styles.recommendations}>
            <div>
              <span className={styles.discountIcon}>%</span>

              <section>
                <strong>Consider Discounts</strong>

                <p>Review inactive products for promotional pricing.</p>
              </section>
            </div>

            <div>
              <span className={styles.bundleIcon}>◆</span>

              <section>
                <strong>Create Product Bundles</strong>

                <p>Pair slower inventory with popular products.</p>
              </section>
            </div>

            <div>
              <span className={styles.supplierIcon}>♣</span>

              <section>
                <strong>Review Purchasing</strong>

                <p>Avoid unnecessary replenishment of inactive products.</p>
              </section>
            </div>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Dead Stock Summary</h2>
              <p>Current impact</p>
            </div>
          </header>

          <div className={styles.summaryVisual}>
            <div className={styles.summaryCircle}>
              <div>
                <strong>{deadStockProducts.length}</strong>
                <span>Products</span>
              </div>
            </div>

            <div className={styles.summaryDetails}>
              <div>
                <span>Units</span>
                <strong>{deadStockUnits}</strong>
              </div>

              <div>
                <span>Value</span>
                <strong>₹{deadStockValue.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className={styles.optimizationCard}>
        <div className={styles.optimizationIcon}>◉</div>

        <div className={styles.optimizationContent}>
          <span>INVENTORY OPTIMIZATION</span>

          <h2>Reduce Inactive Inventory and Free Up Working Capital</h2>

          <p>
            Review products with extended inactivity before purchasing
            additional stock.
          </p>
        </div>

        <button type="button" onClick={() => navigate("/inventory")}>
          View Inventory
          <span>→</span>
        </button>
      </section>
    </div>
  );
}

export default DeadStock;
