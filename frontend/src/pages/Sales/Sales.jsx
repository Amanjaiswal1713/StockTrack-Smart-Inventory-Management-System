import { useContext, useMemo, useState } from "react";
import { DataContext } from "../../context/DataContext";
import Table from "../../components/Table/Table";
import styles from "./Sales.module.css";

function Sales() {
  const {
    products,
    productsLoading,
    sales,
    salesLoading,
    salesError,
    recordSale,
    analytics,
  } = useContext(DataContext);
  const [submitting, setSubmitting] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [query, setQuery] = useState("");

  const selectedProduct = products.find(
    (product) => String(product._id) === String(productId),
  );

  const productName = (sale) => {
    if (sale.product?.name) {
      return sale.product.name;
    }

    return (
      products.find((product) => String(product._id) === String(sale.productId))
        ?.name || "Deleted product"
    );
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      await recordSale({
        productId,
        quantity,
      });

      setProductId("");
      setQuantity("");
    } catch {
      // Error is surfaced by DataProvider.
    } finally {
      setSubmitting(false);
    }
  };
  const filteredSales = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return sales;
    }

    return sales.filter((sale) =>
      productName(sale).toLowerCase().includes(value),
    );
  }, [sales, products, query]);

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.revenue),
    0,
  );

  const totalUnits = sales.reduce(
    (total, sale) => total + Number(sale.quantity),
    0,
  );

  const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;

  const estimatedRevenue =
    selectedProduct && quantity
      ? Number(selectedProduct.price) * Number(quantity)
      : 0;

  const topProducts = analytics?.topProducts?.slice(0, 4) || [];

  const highestSold = Math.max(
    ...topProducts.map((product) => product.sold),
    1,
  );
  const maximumRevenue = Math.max(
    ...sales.map((sale) => Number(sale.revenue || 0)),
    1,
  );
  const percentage = Math.max(
    4,
    (Number(sales.revenue || 0) / maximumRevenue) * 100,
  );
  if (productsLoading || salesLoading) {
    return <div className={styles.page}>Loading sales...</div>;
  }
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Sales Management</h1>

          <p>Record transactions and monitor your sales performance.</p>
        </div>

        <div className={styles.dateBox}>
          <span>▣</span>

          <div>
            <small>Today</small>
            <strong>{new Date().toLocaleDateString("en-IN")}</strong>
          </div>
        </div>
      </header>
      {salesError && (
        <div className={styles.error} role="alert">
          {salesError}
        </div>
      )}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.salesIcon}>🛒</span>

          <div>
            <p>Total Sales</p>
            <strong>{sales.length}</strong>
            <small>Recorded transactions</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.revenueIcon}>₹</span>

          <div>
            <p>Total Revenue</p>
            <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
            <small>Revenue generated</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.unitsIcon}>◆</span>

          <div>
            <p>Items Sold</p>
            <strong>{totalUnits}</strong>
            <small>Total units sold</small>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.averageIcon}>▥</span>

          <div>
            <p>Average Sale</p>
            <strong>₹{Math.round(averageSale).toLocaleString("en-IN")}</strong>
            <small>Per transaction</small>
          </div>
        </article>
      </section>

      <section className={styles.saleSection}>
        <form className={styles.saleForm} onSubmit={handleSubmit}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Record New Sale</h2>

              <p>Select a product and enter the quantity.</p>
            </div>

            <span className={styles.formIcon}>🛒</span>
          </header>

          <label>
            <span>Product</span>

            <select
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              required
            >
              <option value="">Select a product</option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                  disabled={Number(product.stock) === 0}
                >
                  {product.name} ({product.stock} available)
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Quantity</span>

            <input
              type="number"
              min="1"
              max={selectedProduct ? selectedProduct.stock : undefined}
              value={quantity}
              placeholder="Enter quantity"
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </label>

          {selectedProduct && (
            <div className={styles.salePreview}>
              <div>
                <span>Unit Price</span>

                <strong>
                  ₹{Number(selectedProduct.price).toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Available</span>

                <strong>{selectedProduct.stock} units</strong>
              </div>

              <div>
                <span>Sale Revenue</span>

                <strong className={styles.greenText}>
                  ₹{estimatedRevenue.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={styles.recordButton}
            disabled={submitting || productsLoading || !selectedProduct}
          >
            <span>＋</span>

            {submitting ? "Recording..." : "Record Sale"}
          </button>
        </form>

        <article className={styles.overviewCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Sales Overview</h2>
              <p>Transaction performance</p>
            </div>
          </header>

          <div className={styles.overviewNumbers}>
            <div>
              <span>Revenue</span>

              <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Transactions</span>
              <strong>{sales.length}</strong>
            </div>
          </div>

          <div className={styles.chart}>
            <span className={styles.lineOne} />
            <span className={styles.lineTwo} />
            <span className={styles.lineThree} />

            <div className={styles.bars}>
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
            </div>
          </div>

          <div className={styles.chartLabels}>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>
        </article>
      </section>

      <section className={styles.salesTable}>
        <header className={styles.tableHeader}>
          <div>
            <h2>Sales History</h2>

            <p>Review all recorded sales transactions.</p>
          </div>

          <div className={styles.search}>
            <span>⌕</span>

            <input
              type="search"
              value={query}
              placeholder="Search product..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </header>

        <Table
          columns={[
            "Product",
            "Quantity",
            "Unit Price",
            "Revenue",
            "Date",
            "Status",
          ]}
          data={filteredSales}
          emptyMessage="No sales transactions found"
          renderRow={(sale) => (
            <tr key={sale._id}>
              <td>
                <div className={styles.productCell}>
                  <span>◆</span>

                  <div>
                    <strong>{productName(sale)}</strong>

                    <small>Transaction #{String(sale._id).slice(0, 8)}</small>
                  </div>
                </div>
              </td>

              <td>
                <strong>{sale.quantity}</strong>
                <span className={styles.unitsLabel}> units</span>
              </td>

              <td>₹{Number(sale.unitPrice).toLocaleString("en-IN")}</td>

              <td>
                <strong className={styles.revenue}>
                  ₹{Number(sale.revenue).toLocaleString("en-IN")}
                </strong>
              </td>

              <td>{new Date(sale.date).toLocaleDateString("en-IN")}</td>

              <td>
                <span className={styles.completed}>
                  <span />
                  Completed
                </span>
              </td>
            </tr>
          )}
        />

        <div className={styles.tableFooter}>
          <span>
            Showing {filteredSales.length} of {sales.length} sales
          </span>

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
        <article className={styles.topProducts}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Top Selling Products</h2>
              <p>Best performing inventory</p>
            </div>
          </header>

          <div className={styles.productList}>
            {topProducts.map((product, index) => (
              <div className={styles.topProductRow} key={product._id}>
                <span className={styles.rank}>{index + 1}</span>

                <div className={styles.productInfo}>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>

                <div className={styles.progress}>
                  <span
                    style={{
                      width: `${(product.sold / highestSold) * 100}%`,
                    }}
                  />
                </div>

                <strong className={styles.sold}>{product.sold}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.summaryCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Sales Summary</h2>
              <p>Current performance</p>
            </div>
          </header>

          <div className={styles.summaryList}>
            <div>
              <span className={styles.summaryBlue}>▥</span>

              <section>
                <small>Transactions</small>
                <strong>{sales.length}</strong>
              </section>
            </div>

            <div>
              <span className={styles.summaryGreen}>₹</span>

              <section>
                <small>Revenue</small>
                <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
              </section>
            </div>

            <div>
              <span className={styles.summaryOrange}>◆</span>

              <section>
                <small>Items Sold</small>
                <strong>{totalUnits}</strong>
              </section>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Sales;
