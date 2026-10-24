import { useContext, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataContext } from "../../context/DataContext";
import styles from "./Analytics.module.css";

function Analytics() {
  const {
    products,
    sales,
    analytics,
    inventoryValue,
    inventoryHealthScore,
    lowStockProducts,
    outOfStockProducts,
    deadStockProducts,
  } = useContext(DataContext);
  const productPerformance = products.map((product) => {
    const productSales = sales.filter(
      (sale) => String(sale.productId) === String(product._id),
    );

    const sold = productSales.reduce(
      (total, sale) => total + Number(sale.quantity),
      0,
    );

    const revenue = productSales.reduce(
      (total, sale) => total + Number(sale.revenue),
      0,
    );

    return {
      ...product,
      sold,
      salesRevenue: revenue,
    };
  });

  const stockChartData = products.map((product) => ({
    name: product.name,
    stock: Number(product.stock),
  }));

  const categoryData = useMemo(() => {
    const categoryMap = {};

    products.forEach((product) => {
      const category = product.category || "Other";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          products: 0,
          stock: 0,
          value: 0,
        };
      }

      categoryMap[category].products += 1;
      categoryMap[category].stock += Number(product.stock);

      categoryMap[category].value +=
        Number(product.stock) * Number(product.price);
    });

    return Object.values(categoryMap);
  }, [products]);

  const inStockCount = products.filter(
    (product) => Number(product.stock) > Number(product.minStock),
  ).length;

  const stockDistribution = [
    {
      name: "In Stock",
      value: inStockCount,
      color: "#10b981",
    },
    {
      name: "Low Stock",
      value: lowStockProducts.length,
      color: "#f59e0b",
    },
    {
      name: "Out of Stock",
      value: outOfStockProducts.length,
      color: "#ef4444",
    },
  ];

  const topProducts = [...productPerformance]
    .sort((first, second) => second.sold - first.sold)
    .slice(0, 5);

  const lowPerformingProducts = [...productPerformance]
    .sort((first, second) => first.sold - second.sold)
    .slice(0, 5);

  const maximumSold = Math.max(
    ...topProducts.map((product) => product.sold),
    1,
  );

  const averageRevenue =
    sales.length > 0 ? analytics.totalRevenue / sales.length : 0;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Analytics</h1>

          <p>Understand your sales, products and inventory performance.</p>
        </div>

        <button type="button" className={styles.periodButton}>
          <span>▣</span>
          This Month
          <span>⌄</span>
        </button>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.revenueIcon}>₹</span>

          <div>
            <p>Total Revenue</p>

            <strong>₹{analytics.totalRevenue.toLocaleString("en-IN")}</strong>

            <small>From {sales.length} transactions</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.salesIcon}>▥</span>

          <div>
            <p>Total Sales</p>

            <strong>{analytics.totalSaleTransactions}</strong>

            <small>{analytics.totalUnitsSold} units sold</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.productIcon}>◆</span>

          <div>
            <p>Total Products</p>

            <strong>{products.length}</strong>

            <small>{lowStockProducts.length} low stock</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.inventoryIcon}>▣</span>

          <div>
            <p>Inventory Value</p>

            <strong>₹{inventoryValue.toLocaleString("en-IN")}</strong>

            <small>Health {inventoryHealthScore}%</small>
          </div>
        </article>
      </section>

      <section className={styles.chartGrid}>
        <article className={styles.largeChartCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Product Stock Overview</h2>

              <p>Current stock quantity by product</p>
            </div>

            <span className={styles.chartTag}>Inventory</span>
          </header>

          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#edf1f4"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 9,
                    fill: "#7b899a",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 9,
                    fill: "#7b899a",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(16,185,129,0.05)",
                  }}
                />

                <Bar
                  dataKey="stock"
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={styles.distributionCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Stock Distribution</h2>

              <p>Inventory status</p>
            </div>
          </header>

          <div className={styles.pieContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {stockDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className={styles.pieCenter}>
              <strong>{products.length}</strong>
              <span>Products</span>
            </div>
          </div>

          <div className={styles.legend}>
            {stockDistribution.map((item) => (
              <div key={item.name}>
                <span
                  style={{
                    background: item.color,
                  }}
                />

                <p>{item.name}</p>

                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.middleGrid}>
        <article className={styles.topProductsCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Top Selling Products</h2>

              <p>Best performing products by units sold</p>
            </div>
          </header>

          <div className={styles.productList}>
            {topProducts.map((product, index) => (
              <div className={styles.productRow} key={product._id}>
                <span className={styles.rank}>{index + 1}</span>

                <div className={styles.productName}>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>

                <div className={styles.progress}>
                  <span
                    style={{
                      width: `${(product.sold / maximumSold) * 100}%`,
                    }}
                  />
                </div>

                <div className={styles.sold}>
                  <strong>{product.sold}</strong>
                  <small>sold</small>
                </div>
              </div>
            ))}

            {topProducts.length === 0 && (
              <p className={styles.empty}>No sales data available.</p>
            )}
          </div>
        </article>

        <article className={styles.categoryCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Category Analysis</h2>

              <p>Inventory grouped by category</p>
            </div>
          </header>

          <div className={styles.categoryList}>
            {categoryData.map((category, index) => (
              <div className={styles.categoryRow} key={category.name}>
                <span
                  className={
                    index % 4 === 0
                      ? styles.categoryBlue
                      : index % 4 === 1
                        ? styles.categoryGreen
                        : index % 4 === 2
                          ? styles.categoryOrange
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
                  <strong>{category.stock}</strong>
                  <small>units</small>
                </section>

                <section>
                  <strong>₹{category.value.toLocaleString("en-IN")}</strong>

                  <small>value</small>
                </section>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.insightCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Key Insights</h2>

              <p>Quick business overview</p>
            </div>
          </header>

          <div className={styles.insightList}>
            <div>
              <span className={styles.insightGreen}>₹</span>

              <section>
                <strong>Average Sale Value</strong>

                <p>
                  ₹{Math.round(averageRevenue).toLocaleString("en-IN")} per
                  transaction
                </p>
              </section>
            </div>

            <div>
              <span className={styles.insightBlue}>◆</span>

              <section>
                <strong>Inventory Health</strong>

                <p>
                  Current inventory health score is {inventoryHealthScore}%.
                </p>
              </section>
            </div>

            <div>
              <span className={styles.insightOrange}>△</span>

              <section>
                <strong>Stock Attention</strong>

                <p>
                  {lowStockProducts.length} low-stock and{" "}
                  {outOfStockProducts.length} out-of-stock products.
                </p>
              </section>
            </div>
          </div>
        </article>

        <article className={styles.lowPerformanceCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Low Performing Products</h2>

              <p>Products with lower sales activity</p>
            </div>
          </header>

          <div className={styles.lowPerformanceList}>
            {lowPerformingProducts.map((product) => (
              <div key={product._id}>
                <span>◆</span>

                <section>
                  <strong>{product.name}</strong>

                  <small>{product.category}</small>
                </section>

                <div>
                  <strong>{product.sold}</strong>
                  <small>sold</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.healthCard}>
          <header>
            <h2>Inventory Health</h2>
            <p>Overall stock condition</p>
          </header>

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

              <span>Health Score</span>
            </div>
          </div>

          <p className={styles.healthMessage}>
            {inventoryHealthScore >= 80
              ? "Your inventory is in good condition."
              : "Some inventory items need attention."}
          </p>
        </article>
      </section>
    </div>
  );
}

export default Analytics;
