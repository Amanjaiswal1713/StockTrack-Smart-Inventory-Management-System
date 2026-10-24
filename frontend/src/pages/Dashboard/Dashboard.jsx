import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { DataContext } from "../../context/DataContext";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    products,
    suppliers,
    sales,
    dashboardStats,
    inventoryHealthScore,
    analytics,
    lowStockProducts,
    outOfStockProducts,
    activities,
  } = useContext(DataContext);

  const recentProducts = [...products]
    .sort(
      (first, second) =>
        new Date(second.createdAt || 0) - new Date(first.createdAt || 0),
    )
    .slice(0, 5);

  const recentActivities = activities.slice(0, 5);
  const topProducts = analytics.topProducts.slice(0, 5);

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
  const productStatus = (product) => {
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

  const maximumSold = Math.max(
    ...topProducts.map((product) => product.sold),
    1,
  );

  const totalInventoryCount = Math.max(products.length, 1);

  const inStockCount = products.filter(
    (product) => Number(product.stock) > Number(product.minStock),
  ).length;

  const lowStockPercentage =
    (lowStockProducts.length / totalInventoryCount) * 100;

  const outOfStockPercentage =
    (outOfStockProducts.length / totalInventoryCount) * 100;

  const inStockPercentage = (inStockCount / totalInventoryCount) * 100;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>
            Welcome Back, <span>{user?.fullName || "Admin"}!</span>
          </h1>

          <p>Here&apos;s what&apos;s happening with your inventory today.</p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.dateButton}>
            <span>▣</span>
            Today
            <span>⌄</span>
          </button>

          <button
            type="button"
            className={styles.addButton}
            onClick={() => navigate("/products")}
          >
            <span>＋</span>
            Add Product
          </button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <article className={`${styles.statCard} ${styles.blueCard}`}>
          <div className={styles.statTop}>
            <span className={styles.blueStatIcon}>◆</span>

            <span className={styles.trendPositive}>↗ Active</span>
          </div>

          <div className={styles.statContent}>
            <div>
              <p>Total Products</p>
              <strong>{dashboardStats.totalProducts}</strong>
            </div>

            <span
              className={styles.cardArrow}
              onClick={() => navigate("/products")}
            >
              →
            </span>
          </div>

          <div className={styles.statFooter}>
            <span>View all products</span>
          </div>
        </article>

        <article className={`${styles.statCard} ${styles.greenCard}`}>
          <div className={styles.statTop}>
            <span className={styles.greenStatIcon}>▥</span>

            <span className={styles.trendPositive}>↗ Growing</span>
          </div>

          <div className={styles.statContent}>
            <div>
              <p>Total Sales</p>
              <strong>{dashboardStats.totalSales}</strong>
            </div>

            <span
              className={styles.cardArrow}
              onClick={() => navigate("/sales")}
            >
              →
            </span>
          </div>

          <div className={styles.statFooter}>
            <span>
              ₹{dashboardStats.totalRevenue.toLocaleString("en-IN")} revenue
            </span>
          </div>
        </article>

        <article className={`${styles.statCard} ${styles.purpleCard}`}>
          <div className={styles.statTop}>
            <span className={styles.purpleStatIcon}>♣</span>

            <span className={styles.neutralTag}>Registered</span>
          </div>

          <div className={styles.statContent}>
            <div>
              <p>Total Suppliers</p>
              <strong>{dashboardStats.totalSuppliers}</strong>
            </div>

            <span
              className={styles.cardArrow}
              onClick={() => navigate("/suppliers")}
            >
              →
            </span>
          </div>

          <div className={styles.statFooter}>
            <span>Manage suppliers</span>
          </div>
        </article>

        <article className={`${styles.statCard} ${styles.orangeCard}`}>
          <div className={styles.statTop}>
            <span className={styles.orangeStatIcon}>△</span>

            <span className={styles.warningTag}>Needs Attention</span>
          </div>

          <div className={styles.statContent}>
            <div>
              <p>Low Stock Items</p>
              <strong>{dashboardStats.lowStockCount}</strong>
            </div>

            <span
              className={styles.cardArrow}
              onClick={() => navigate("/low-stock")}
            >
              →
            </span>
          </div>

          <div className={styles.statFooter}>
            <span>{dashboardStats.outOfStockCount} out of stock</span>
          </div>
        </article>
      </section>

      <section className={styles.mainGrid}>
        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <div>
              <h2>Sales Overview</h2>
              <p>Revenue and transaction performance</p>
            </div>

            <button type="button">
              This Month
              <span>⌄</span>
            </button>
          </header>

          <div className={styles.salesSummary}>
            <div>
              <span>Total Revenue</span>

              <strong>₹{analytics.totalRevenue.toLocaleString("en-IN")}</strong>

              <small className={styles.positiveText}>
                ↗ Current sales performance
              </small>
            </div>

            <div>
              <span>Units Sold</span>

              <strong>{analytics.totalUnitsSold}</strong>

              <small>{analytics.totalSaleTransactions} transactions</small>
            </div>
          </div>

          <div className={styles.salesChart}>
            <div className={styles.axisLabels}>
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className={styles.chartPlot}>
              <span className={styles.chartLineOne} />
              <span className={styles.chartLineTwo} />
              <span className={styles.chartLineThree} />
              <span className={styles.chartLineFour} />
              <span className={styles.chartLineFive} />

              <svg
                viewBox="0 0 600 170"
                preserveAspectRatio="none"
                className={styles.chartSvg}
              >
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M0 145 L70 120 L140 132 L220 87 L300 104 L380 66 L460 82 L530 45 L600 55 L600 170 L0 170 Z"
                  fill="url(#salesGradient)"
                />

                <polyline
                  points="0,145 70,120 140,132 220,87 300,104 380,66 460,82 530,45 600,55"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx="70"
                  cy="120"
                  r="5"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                <circle
                  cx="220"
                  cy="87"
                  r="5"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                <circle
                  cx="380"
                  cy="66"
                  r="5"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                <circle
                  cx="530"
                  cy="45"
                  r="5"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="3"
                />
              </svg>

              <div className={styles.monthLabels}>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>
        </article>

        <article className={styles.inventoryPanel}>
          <header className={styles.panelHeader}>
            <div>
              <h2>Inventory Status</h2>
              <p>Current stock health</p>
            </div>

            <button
              type="button"
              className={styles.viewButton}
              onClick={() => navigate("/inventory")}
            >
              View All
            </button>
          </header>

          <div className={styles.inventoryChart}>
            <div
              className={styles.donut}
              style={{
                background: `conic-gradient(
                    #10b981 0% ${inStockPercentage}%,
                    #f59e0b ${inStockPercentage}% ${
                      inStockPercentage + lowStockPercentage
                    }%,
                    #ef4444 ${inStockPercentage + lowStockPercentage}% 100%
                  )`,
              }}
            >
              <div>
                <strong>{products.length}</strong>
                <span>Total Items</span>
              </div>
            </div>
          </div>

          <div className={styles.inventoryLegend}>
            <div>
              <span className={styles.greenDot} />

              <section>
                <strong>{inStockCount}</strong>
                <small>In Stock</small>
              </section>

              <em>{Math.round(inStockPercentage)}%</em>
            </div>

            <div>
              <span className={styles.yellowDot} />

              <section>
                <strong>{lowStockProducts.length}</strong>
                <small>Low Stock</small>
              </section>

              <em>{Math.round(lowStockPercentage)}%</em>
            </div>

            <div>
              <span className={styles.redDot} />

              <section>
                <strong>{outOfStockProducts.length}</strong>
                <small>Out of Stock</small>
              </section>

              <em>{Math.round(outOfStockPercentage)}%</em>
            </div>
          </div>

          <div className={styles.healthScore}>
            <div className={styles.healthHeading}>
              <span>Inventory Health Score</span>

              <strong>{inventoryHealthScore}%</strong>
            </div>

            <div className={styles.healthProgress}>
              <span
                style={{
                  width: `${inventoryHealthScore}%`,
                }}
              />
            </div>

            <small>
              {inventoryHealthScore >= 80
                ? "Your inventory is in good condition."
                : "Some inventory items need attention."}
            </small>
          </div>
        </article>

        <aside className={styles.quickActions}>
          <header className={styles.panelHeader}>
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your inventory</p>
            </div>
          </header>

          <div className={styles.actionsGrid}>
            <button type="button" onClick={() => navigate("/products")}>
              <span className={styles.actionGreen}>＋</span>

              <div>
                <strong>Add Product</strong>
                <small>Create a new product</small>
              </div>

              <em>›</em>
            </button>

            <button type="button" onClick={() => navigate("/sales")}>
              <span className={styles.actionBlue}>🛒</span>

              <div>
                <strong>Record Sale</strong>
                <small>Add a sales transaction</small>
              </div>

              <em>›</em>
            </button>

            <button type="button" onClick={() => navigate("/inventory")}>
              <span className={styles.actionPurple}>▣</span>

              <div>
                <strong>Adjust Stock</strong>
                <small>Update inventory levels</small>
              </div>

              <em>›</em>
            </button>

            <button type="button" onClick={() => navigate("/reports")}>
              <span className={styles.actionOrange}>▤</span>

              <div>
                <strong>View Reports</strong>
                <small>Review business data</small>
              </div>

              <em>›</em>
            </button>
          </div>
        </aside>
      </section>

      <section className={styles.secondaryGrid}>
        <article className={styles.tablePanel}>
          <header className={styles.panelHeader}>
            <div>
              <h2>Recent Products</h2>
              <p>Recently added inventory items</p>
            </div>

            <button
              type="button"
              className={styles.viewButton}
              onClick={() => navigate("/products")}
            >
              View All
            </button>
          </header>

          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => {
                    const status = productStatus(product);

                    return (
                      <tr key={product._id}>
                        <td>
                          <div className={styles.productCell}>
                            <span>◆</span>

                            <section>
                              <strong>{product.name}</strong>
                              <small>{product.sku}</small>
                            </section>
                          </div>
                        </td>

                        <td>{product.category}</td>

                        <td>{supplierName(product)}</td>

                        <td>
                          <strong>{product.stock}</strong>
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.empty}>
                      No products available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className={styles.alertPanel}>
          <header className={styles.panelHeader}>
            <div>
              <h2>Low Stock Alerts</h2>
              <p>Products that need restocking</p>
            </div>

            <button
              type="button"
              className={styles.viewButton}
              onClick={() => navigate("/low-stock")}
            >
              View All
            </button>
          </header>

          <div className={styles.alertList}>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map((product) => (
                <div className={styles.alertItem} key={product._id}>
                  <span className={styles.alertIcon}>△</span>

                  <div className={styles.alertInformation}>
                    <strong>{product.name}</strong>

                    <small>{product.stock} units remaining</small>

                    <div className={styles.stockProgress}>
                      <span
                        style={{
                          width: `${Math.min(
                            100,
                            (Number(product.stock) /
                              Math.max(Number(product.minStock), 1)) *
                              100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button type="button" onClick={() => navigate("/inventory")}>
                    Restock
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyAlert}>
                <span>✓</span>

                <strong>Stock levels look good</strong>

                <small>There are currently no low-stock products.</small>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.topProductsPanel}>
          <header className={styles.panelHeader}>
            <div>
              <h2>Top Selling Products</h2>
              <p>Products with the highest sales</p>
            </div>

            <button
              type="button"
              className={styles.viewButton}
              onClick={() => navigate("/analytics")}
            >
              Analytics
            </button>
          </header>

          <div className={styles.topProductList}>
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div className={styles.topProduct} key={product._id}>
                  <span className={styles.rank}>{index + 1}</span>

                  <div className={styles.topProductName}>
                    <strong>{product.name}</strong>
                    <small>{product.category}</small>
                  </div>

                  <div className={styles.salesBar}>
                    <span
                      style={{
                        width: `${(product.sold / maximumSold) * 100}%`,
                      }}
                    />
                  </div>

                  <div className={styles.soldCount}>
                    <strong>{product.sold}</strong>
                    <small>sold</small>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.empty}>No sales data available.</p>
            )}
          </div>
        </article>

        <article className={styles.activityPanel}>
          <header className={styles.panelHeader}>
            <div>
              <h2>Recent Activity</h2>
              <p>Latest system updates</p>
            </div>
          </header>

          <div className={styles.activityList}>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div className={styles.activityItem} key={activity.id}>
                  <span
                    className={
                      index % 3 === 0
                        ? styles.activityIconGreen
                        : index % 3 === 1
                          ? styles.activityIconBlue
                          : styles.activityIconOrange
                    }
                  >
                    {index % 3 === 0 ? "◆" : index % 3 === 1 ? "▣" : "●"}
                  </span>

                  <div>
                    <strong>{activity.message}</strong>

                    <small>
                      {activity.date
                        ? new Date(activity.date).toLocaleString("en-IN")
                        : "Recently"}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.empty}>No recent activity.</p>
            )}
          </div>
        </article>
      </section>

      <footer className={styles.dashboardFooter}>
        <div>
          <span>🌱</span>

          <p>
            Organize Today
            <strong> Grow Tomorrow</strong>
          </p>
        </div>

        <span>StockTrack Smart Inventory Management</span>
      </footer>
    </div>
  );
}

export default Dashboard;
