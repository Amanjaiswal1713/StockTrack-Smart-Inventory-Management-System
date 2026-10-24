import { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import { exportJson } from "../../utils/exportUtils";
import styles from "./Reports.module.css";

function Reports() {
  const {
    products,
    suppliers,
    sales,
    inventoryLogs,
    analytics,
    inventoryValue,
    lowStockProducts,
    deadStockProducts,
    outOfStockProducts,
    reportData,
    reportLoading,
    reportError,
    loadReport,
  } = useContext(DataContext);
  useEffect(() => {
    loadReport().catch(() => {});
  }, [loadReport]);
  const totalStockUnits = products.reduce(
    (total, product) => total + Number(product.stock),
    0,
  );

  const averageProductValue =
    products.length > 0 ? inventoryValue / products.length : 0;

  const averageTransaction =
    sales.length > 0 ? analytics.totalRevenue / sales.length : 0;

  const report = reportData || {
    generatedAt: new Date().toISOString(),
    productReport: {
      totalProducts: products.length,
      totalStockUnits,
      inventoryValue,
      averageProductValue,
      lowStockProducts: lowStockProducts.length,
      deadStockProducts: deadStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      products,
    },
    supplierReport: {
      totalSuppliers: suppliers.length,
      suppliers,
    },
    salesReport: {
      totalTransactions: sales.length,
      totalUnitsSold: analytics.totalUnitsSold,
      totalRevenue: analytics.totalRevenue,
      averageTransaction,
      sales,
    },
    inventoryReport: {
      inventoryValue,
      totalStockUnits,
      movements: inventoryLogs,
    },
  };
  const reportCards = [
    {
      icon: "◆",
      className: styles.blueIcon,
      title: "Product Report",
      description: "Complete product and inventory information.",
      value: products.length,
      label: "Total Products",
      action: () =>
        exportJson(
          {
            totalProducts: products.length,
            inventoryValue,
            products,
          },
          "stocktrack-products.json",
        ),
    },
    {
      icon: "♣",
      className: styles.purpleIcon,
      title: "Supplier Report",
      description: "Supplier information and business contacts.",
      value: suppliers.length,
      label: "Total Suppliers",
      action: () =>
        exportJson(
          {
            totalSuppliers: suppliers.length,
            suppliers,
          },
          "stocktrack-suppliers.json",
        ),
    },
    {
      icon: "▥",
      className: styles.greenIcon,
      title: "Sales Report",
      description: "Sales transactions and revenue performance.",
      value: sales.length,
      label: "Transactions",
      action: () =>
        exportJson(
          {
            totalTransactions: sales.length,
            totalUnitsSold: analytics.totalUnitsSold,
            totalRevenue: analytics.totalRevenue,
            sales,
          },
          "stocktrack-sales.json",
        ),
    },
    {
      icon: "▣",
      className: styles.orangeIcon,
      title: "Inventory Report",
      description: "Current inventory value and stock movements.",
      value: totalStockUnits,
      label: "Stock Units",
      action: () =>
        exportJson(
          {
            inventoryValue,
            totalStockUnits,
            movements: inventoryLogs,
          },
          "stocktrack-inventory.json",
        ),
    },
  ];
  const maximumRevenue = Math.max(
    ...sales.map((sale) => Number(sale.revenue || 0)),
    1,
  );
  const percentage = Math.max(
    4,
    (Number(sales.revenue || 0) / maximumRevenue) * 100,
  );

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Reports</h1>

          <p>Review and export your StockTrack business data.</p>
        </div>

        <button
          type="button"
          disabled={reportLoading}
          className={styles.exportAllButton}
          onClick={() => exportJson(report, "stocktrack-complete-report.json")}
        >
          <span>⇩</span>
          {reportLoading ? "Preparing Report..." : "Export Complete Report"}
        </button>
        {reportError && (
          <div className={styles.error} role="alert">
            {reportError}
          </div>
        )}
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <span className={styles.productSummary}>◆</span>

          <div>
            <p>Total Products</p>
            <strong>{products.length}</strong>
            <small>{totalStockUnits} stock units</small>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <span className={styles.revenueSummary}>₹</span>

          <div>
            <p>Total Revenue</p>

            <strong>₹{analytics.totalRevenue.toLocaleString("en-IN")}</strong>

            <small>{sales.length} transactions</small>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <span className={styles.inventorySummary}>▣</span>

          <div>
            <p>Inventory Value</p>

            <strong>₹{inventoryValue.toLocaleString("en-IN")}</strong>

            <small>Current stock valuation</small>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <span className={styles.supplierSummary}>♣</span>

          <div>
            <p>Total Suppliers</p>
            <strong>{suppliers.length}</strong>
            <small>Supplier network</small>
          </div>
        </article>
      </section>

      <section className={styles.reportSection}>
        <header className={styles.sectionHeader}>
          <div>
            <h2>Available Reports</h2>

            <p>Choose a report to export as JSON.</p>
          </div>
        </header>

        <div className={styles.reportGrid}>
          {reportCards.map((reportCard) => (
            <article className={styles.reportCard} key={reportCard.title}>
              <div className={styles.reportTop}>
                <span
                  className={`${styles.reportIcon} ${reportCard.className}`}
                >
                  {reportCard.icon}
                </span>

                <span className={styles.ready}>
                  <span />
                  Ready
                </span>
              </div>

              <h3>{reportCard.title}</h3>

              <p>{reportCard.description}</p>

              <div className={styles.reportValue}>
                <strong>{reportCard.value}</strong>
                <span>{reportCard.label}</span>
              </div>

              <button type="button" onClick={reportCard.action}>
                <span>⇩</span>
                Export Report
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.detailsGrid}>
        <article className={styles.performanceCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Sales Performance</h2>
              <p>Financial report overview</p>
            </div>

            <span className={styles.greenBadge}>Sales</span>
          </header>

          <div className={styles.performanceStats}>
            <div>
              <span>Total Revenue</span>

              <strong>₹{analytics.totalRevenue.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Units Sold</span>

              <strong>{analytics.totalUnitsSold}</strong>
            </div>

            <div>
              <span>Transactions</span>

              <strong>{sales.length}</strong>
            </div>

            <div>
              <span>Average Transaction</span>

              <strong>
                ₹{Math.round(averageTransaction).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <div className={styles.chart}>
            <span className={styles.chartLineOne} />
            <span className={styles.chartLineTwo} />
            <span className={styles.chartLineThree} />

            <div className={styles.chartBars}>
              <span
                style={{
                  height: `${percentage}%`,
                }}
              />
              <span
                style={{
                  height: `${percentage}%`,
                }}
              />
              <span
                style={{
                  height: `${percentage}%`,
                }}
              />
              <span
                style={{
                  height: `${percentage}%`,
                }}
              />
              <span
                style={{
                  height: `${percentage}%`,
                }}
              />
              <span
                stylestyle={{
                  height: `${percentage}%`,
                }}
              />
              <span
                style={{
                  height: `${percentage}%`,
                }}
              />
            </div>
          </div>
        </article>

        <article className={styles.inventoryCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Inventory Report</h2>
              <p>Current stock condition</p>
            </div>

            <span className={styles.blueBadge}>Inventory</span>
          </header>

          <div className={styles.inventoryList}>
            <div>
              <span className={styles.inventoryGreen}>✓</span>

              <section>
                <small>Total Stock Units</small>
                <strong>{totalStockUnits}</strong>
              </section>
            </div>

            <div>
              <span className={styles.inventoryYellow}>△</span>

              <section>
                <small>Low Stock</small>
                <strong>{lowStockProducts.length}</strong>
              </section>
            </div>

            <div>
              <span className={styles.inventoryRed}>×</span>

              <section>
                <small>Out of Stock</small>
                <strong>{outOfStockProducts.length}</strong>
              </section>
            </div>

            <div>
              <span className={styles.inventoryPurple}>◉</span>

              <section>
                <small>Dead Stock</small>
                <strong>{deadStockProducts.length}</strong>
              </section>
            </div>
          </div>
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.productInsights}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Product Insights</h2>
              <p>Current product report summary</p>
            </div>
          </header>

          <div className={styles.insightRows}>
            <div>
              <span>Total Products</span>
              <strong>{products.length}</strong>
            </div>

            <div>
              <span>Total Stock Units</span>
              <strong>{totalStockUnits}</strong>
            </div>

            <div>
              <span>Average Product Value</span>

              <strong>
                ₹{Math.round(averageProductValue).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Inventory Value</span>

              <strong>₹{inventoryValue.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </article>

        <article className={styles.movementCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Inventory Movements</h2>
              <p>Recorded stock activity</p>
            </div>
          </header>

          <div className={styles.movementSummary}>
            <div className={styles.movementNumber}>
              <strong>{inventoryLogs.length}</strong>
              <span>Total Movements</span>
            </div>

            <div className={styles.movementTypes}>
              <div>
                <span className={styles.greenDot} />
                <p>Stock In</p>
                <strong>
                  {
                    inventoryLogs.filter((log) => log.type === "STOCK_IN")
                      .length
                  }
                </strong>
              </div>

              <div>
                <span className={styles.redDot} />
                <p>Stock Out / Sale</p>
                <strong>
                  {
                    inventoryLogs.filter((log) => log.type !== "STOCK_IN")
                      .length
                  }
                </strong>
              </div>
            </div>
          </div>
        </article>

        <article className={styles.exportCard}>
          <span className={styles.exportIcon}>⇩</span>

          <h2>Complete Business Report</h2>

          <p>
            Export products, suppliers, sales and inventory information
            together.
          </p>

          <button
            type="button"
            disabled={reportLoading}
            onClick={() =>
              exportJson(report, "stocktrack-complete-report.json")
            }
          >
            {reportLoading ? "Preparing Report..." : "Download Report"}
          </button>
        </article>
      </section>
    </div>
  );
}

export default Reports;
