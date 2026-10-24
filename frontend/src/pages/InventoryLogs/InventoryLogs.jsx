import { useContext, useMemo, useState } from "react";
import { DataContext } from "../../context/DataContext";
import Table from "../../components/Table/Table";
import styles from "./InventoryLogs.module.css";

function InventoryLogs() {
  const { inventoryLogs, inventoryLoading, inventoryError, products } =
    useContext(DataContext);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const productName = (log) => {
    if (log.product?.name) {
      return log.product.name;
    }

    return (
      products.find((product) => String(product._id) === String(log.productId))
        ?.name || "Deleted product"
    );
  };

  const productSku = (log) => {
    if (log.product?.sku) {
      return log.product.sku;
    }

    return (
      products.find((product) => String(product._id) === String(log.productId))
        ?.sku || "N/A"
    );
  };

  const filteredLogs = useMemo(() => {
    const search = query.trim().toLowerCase();

    const filtered = inventoryLogs.filter((log) => {
      const name = productName(log);

      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search) ||
        String(log.type).toLowerCase().includes(search);

      const matchesType = typeFilter === "all" || log.type === typeFilter;

      return matchesSearch && matchesType;
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === "oldest") {
        return new Date(first.date) - new Date(second.date);
      }

      if (sortBy === "quantity-high") {
        return Number(second.quantity) - Number(first.quantity);
      }

      return new Date(second.date) - new Date(first.date);
    });
  }, [inventoryLogs, products, query, typeFilter, sortBy]);

  const stockInLogs = inventoryLogs.filter((log) => log.type === "STOCK_IN");

  const stockOutLogs = inventoryLogs.filter((log) => log.type === "STOCK_OUT");

  const saleLogs = inventoryLogs.filter((log) => log.type === "SALE");

  const stockInUnits = stockInLogs.reduce(
    (total, log) => total + Number(log.quantity),
    0,
  );

  const stockOutUnits = stockOutLogs.reduce(
    (total, log) => total + Number(log.quantity),
    0,
  );

  const saleUnits = saleLogs.reduce(
    (total, log) => total + Number(log.quantity),
    0,
  );

  const getMovement = (type) => {
    if (type === "STOCK_IN") {
      return {
        label: "Stock In",
        icon: "↑",
        className: styles.stockIn,
      };
    }

    if (type === "SALE") {
      return {
        label: "Sale",
        icon: "🛒",
        className: styles.sale,
      };
    }

    if (type === "ADJUSTMENT") {
      return {
        label: "Adjustment",
        icon: "↻",
        className: styles.stockOut,
      };
    }

    return {
      label: "Stock Out",
      icon: "↓",
      className: styles.stockOut,
    };
  };

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setSortBy("newest");
  };
  if (inventoryLoading) {
    return <div className={styles.page}>Loading inventory history...</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Inventory Movement Logs</h1>

          <p>Track stock additions, removals and sales activity.</p>
        </div>

        <span className={styles.liveBadge}>
          <span />
          Inventory Activity
        </span>
      </header>
      {inventoryError && (
        <div className={styles.error} role="alert">
          {inventoryError}
        </div>
      )}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.totalIcon}>≡</span>

          <div>
            <p>Total Movements</p>

            <strong>{inventoryLogs.length}</strong>

            <small>Recorded inventory events</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.inIcon}>↑</span>

          <div>
            <p>Stock In</p>

            <strong>{stockInUnits}</strong>

            <small>Across {stockInLogs.length} movements</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.outIcon}>↓</span>

          <div>
            <p>Stock Out</p>

            <strong>{stockOutUnits}</strong>

            <small>Across {stockOutLogs.length} movements</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.saleIcon}>🛒</span>

          <div>
            <p>Sales Movement</p>

            <strong>{saleUnits}</strong>

            <small>Across {saleLogs.length} sales</small>
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
              placeholder="Search product or movement..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="all">All Movements</option>

            <option value="STOCK_IN">Stock In</option>

            <option value="STOCK_OUT">Stock Out</option>

            <option value="SALE">Sales</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Newest First</option>

            <option value="oldest">Oldest First</option>

            <option value="quantity-high">Highest Quantity</option>
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
            <h2>Movement History</h2>

            <p>
              Showing {filteredLogs.length} of {inventoryLogs.length} movements
            </p>
          </div>

          <span className={styles.historyBadge}>▣ Complete History</span>
        </header>

        <Table
          columns={[
            "Movement",
            "Product",
            "SKU",
            "Quantity",
            "Date",
            "Time",
            "Status",
          ]}
          data={filteredLogs}
          emptyMessage="No inventory movements found"
          renderRow={(log) => {
            const movement = getMovement(log.type);
            const date = new Date(log.date);

            return (
              <tr key={log._id}>
                <td>
                  <div
                    className={`${styles.movementCell} ${movement.className}`}
                  >
                    <span>{movement.icon}</span>

                    <strong>{movement.label}</strong>
                  </div>
                </td>

                <td>
                  <div className={styles.productCell}>
                    <span>◆</span>

                    <div>
                      <strong>{productName(log)}</strong>

                      <small>Product movement</small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={styles.sku}>{productSku(log)}</span>
                </td>

                <td>
                  <span
                    className={
                      log.type === "STOCK_IN"
                        ? styles.positiveQuantity
                        : styles.negativeQuantity
                    }
                  >
                    {log.type === "STOCK_IN" ? "+" : "-"}
                    {log.quantity}
                  </span>
                </td>

                <td>{date.toLocaleDateString("en-IN")}</td>

                <td>
                  {date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td>
                  <span className={styles.completed}>
                    <span />
                    Completed
                  </span>
                </td>
              </tr>
            );
          }}
        />

        <div className={styles.tableFooter}>
          <span>Showing {filteredLogs.length} movements</span>

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
        <article className={styles.summaryCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Movement Summary</h2>

              <p>Inventory activity overview</p>
            </div>
          </header>

          <div className={styles.summaryList}>
            <div>
              <span className={styles.smallGreen}>↑</span>

              <section>
                <small>Stock Added</small>
                <strong>{stockInUnits} units</strong>
              </section>
            </div>

            <div>
              <span className={styles.smallRed}>↓</span>

              <section>
                <small>Stock Removed</small>
                <strong>{stockOutUnits} units</strong>
              </section>
            </div>

            <div>
              <span className={styles.smallBlue}>🛒</span>

              <section>
                <small>Sale Movements</small>
                <strong>{saleUnits} units</strong>
              </section>
            </div>
          </div>
        </article>

        <article className={styles.recentCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Recent Movements</h2>

              <p>Latest inventory activity</p>
            </div>
          </header>

          <div className={styles.recentList}>
            {inventoryLogs.slice(0, 5).map((log) => {
              const movement = getMovement(log.type);

              return (
                <div className={styles.recentItem} key={log._id}>
                  <span className={movement.className}>{movement.icon}</span>

                  <div>
                    <strong>{productName(log)}</strong>

                    <small>{movement.label}</small>
                  </div>

                  <em>
                    {log.type === "STOCK_IN" ? "+" : "-"}
                    {log.quantity}
                  </em>
                </div>
              );
            })}
          </div>
        </article>

        <article className={styles.activityCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Activity Distribution</h2>

              <p>Movement types</p>
            </div>
          </header>

          <div className={styles.activityChart}>
            <div
              className={styles.donut}
              style={{
                background: `conic-gradient(
                    #10b981 0deg ${
                      inventoryLogs.length
                        ? (stockInLogs.length / inventoryLogs.length) * 360
                        : 0
                    }deg,
                    #3b82f6 ${
                      inventoryLogs.length
                        ? (stockInLogs.length / inventoryLogs.length) * 360
                        : 0
                    }deg ${
                      inventoryLogs.length
                        ? ((stockInLogs.length + saleLogs.length) /
                            inventoryLogs.length) *
                          360
                        : 0
                    }deg,
                    #ef4444 ${
                      inventoryLogs.length
                        ? ((stockInLogs.length + saleLogs.length) /
                            inventoryLogs.length) *
                          360
                        : 0
                    }deg 360deg
                  )`,
              }}
            >
              <div>
                <strong>{inventoryLogs.length}</strong>

                <span>Total</span>
              </div>
            </div>
          </div>

          <div className={styles.legend}>
            <div>
              <span className={styles.greenDot} />
              <p>Stock In</p>
              <strong>{stockInLogs.length}</strong>
            </div>

            <div>
              <span className={styles.blueDot} />
              <p>Sales</p>
              <strong>{saleLogs.length}</strong>
            </div>

            <div>
              <span className={styles.redDot} />
              <p>Stock Out</p>
              <strong>{stockOutLogs.length}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default InventoryLogs;
