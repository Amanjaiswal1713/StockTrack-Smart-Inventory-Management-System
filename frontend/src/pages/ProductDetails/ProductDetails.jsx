import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import styles from "./ProductDetails.module.css";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, productsLoading, suppliers, sales, inventoryLogs } =
    useContext(DataContext);
  const product = products.find(
    (item) => String(item._id) === String(productId),
  );
  if (productsLoading) {
    return (
      <div className={styles.notFound}>
        <span>◆</span>
        <h1>Loading Product</h1>
        <p>Please wait while the Product information loads.</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className={styles.notFound}>
        <span>◆</span>
        <h1>Product Not Found</h1>
        <p>The requested product does not exist or may have been deleted.</p>
        <button type="button" onClick={() => navigate("/products")}>
          ← Back to Products
        </button>
      </div>
    );
  }
  const supplier =
    product.supplier ||
    suppliers.find((item) => String(item._id) === String(product.supplierId));
  const productSales = sales.filter(
    (sale) => String(sale.productId) === String(product._id),
  );
  const productLogs = inventoryLogs.filter(
    (log) => String(log.productId) === String(product._id),
  );
  const unitsSold = productSales.reduce(
    (total, sale) => total + Number(sale.quantity),
    0,
  );
  const revenue = productSales.reduce(
    (total, sale) => total + Number(sale.revenue),
    0,
  );
  const stockValue = Number(product.stock) * Number(product.price);
  const stockPercentage = Math.min(
    100,
    Number(product.minStock) > 0
      ? (Number(product.stock) / Number(product.minStock)) * 100
      : 100,
  );
  const getStatus = () => {
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
  const status = getStatus();
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <button type="button" onClick={() => navigate("/products")}>
            Products
          </button>
          <span>›</span>
          <strong>{product.name}</strong>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/products")}
          >
            ← Back
          </button>
          <button
            type="button"
            className={styles.inventoryButton}
            onClick={() => navigate("/inventory")}
          >
            ▣ Manage Inventory
          </button>
        </div>
      </header>
      <section className={styles.productHero}>
        <div className={styles.productIdentity}>
          <span className={styles.productIcon}>◆</span>
          <div>
            <div className={styles.titleRow}>
              <h1>{product.name}</h1>
              <span className={`${styles.status} ${status.className}`}>
                <span />
                {status.label}
              </span>
            </div>
            <p>
              SKU: <strong>{product.sku}</strong>
            </p>
            <div className={styles.productTags}>
              <span>{product.category}</span>
              <span>
                Added{" "}
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString("en-IN")
                  : "recently"}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.heroPrice}>
          <span>Unit Price</span>
          <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
          <small>Per inventory unit</small>
        </div>
      </section>
      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.stockIcon}>▣</span>
          <div>
            <p>Current Stock</p>
            <strong>{product.stock}</strong>
            <small>Available units</small>
          </div>
        </article>
        <article className={styles.statCard}>
          <span className={styles.minimumIcon}>△</span>
          <div>
            <p>Minimum Stock</p>
            <strong>{product.minStock}</strong>
            <small>Configured threshold</small>
          </div>
        </article>
        <article className={styles.statCard}>
          <span className={styles.valueIcon}>₹</span>
          <div>
            <p>Stock Value</p>
            <strong>₹{stockValue.toLocaleString("en-IN")}</strong>
            <small>Current inventory value</small>
          </div>
        </article>
        <article className={styles.statCard}>
          <span className={styles.salesIcon}>🛒</span>
          <div>
            <p>Units Sold</p>
            <strong>{unitsSold}</strong>
            <small>{productSales.length} transactions</small>
          </div>
        </article>
      </section>
      <section className={styles.detailsGrid}>
        <article className={styles.informationCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Product Information</h2>
              <p>General product and inventory details</p>
            </div>
            <span className={styles.informationIcon}>◆</span>
          </header>
          <div className={styles.informationGrid}>
            <div>
              <span>Product Name</span>
              <strong>{product.name}</strong>
            </div>
            <div>
              <span>SKU</span>
              <strong>{product.sku}</strong>
            </div>
            <div>
              <span>Category</span>
              <strong>{product.category}</strong>
            </div>
            <div>
              <span>Unit Price</span>
              <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
            </div>
            <div>
              <span>Current Stock</span>
              <strong>{product.stock} units</strong>
            </div>
            <div>
              <span>Minimum Stock</span>
              <strong>{product.minStock} units</strong>
            </div>
          </div>
        </article>
        <article className={styles.stockCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Stock Status</h2>
              <p>Current inventory level</p>
            </div>
            <span className={styles.stockCardIcon}>▣</span>
          </header>
          <div className={styles.stockNumbers}>
            <div>
              <span>Available</span>
              <strong>{product.stock}</strong>
            </div>
            <div>
              <span>Minimum</span>
              <strong>{product.minStock}</strong>
            </div>
          </div>
          <div className={styles.stockProgress}>
            <span
              style={{
                width: `${stockPercentage}%`,
              }}
            />
          </div>
          <div className={styles.stockProgressLabels}>
            <span>0</span>
            <span>{Math.round(stockPercentage)}% of minimum</span>
            <span>{product.minStock}</span>
          </div>
          <div className={`${styles.stockMessage} ${status.className}`}>
            <span>{status.label === "In Stock" ? "✓" : "△"}</span>
            <p>
              {status.label === "In Stock"
                ? "This product has a healthy stock level."
                : status.label === "Low Stock"
                  ? "This product should be restocked soon."
                  : "This product is currently unavailable."}
            </p>
          </div>
        </article>
        <article className={styles.supplierCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Supplier Information</h2>
              <p>Assigned product supplier</p>
            </div>
            <span className={styles.supplierIcon}>♣</span>
          </header>
          {supplier ? (
            <div className={styles.supplierDetails}>
              <span className={styles.supplierAvatar}>
                {supplier.company?.charAt(0)?.toUpperCase() || "S"}
              </span>
              <div className={styles.supplierName}>
                <strong>{supplier.company}</strong>
                <small>{supplier.name}</small>
              </div>
              <div className={styles.contactDetails}>
                <div>
                  <span>✉</span>
                  {supplier.email ? (
                    <a href={`mailto:${supplier.email}`}>{supplier.email}</a>
                  ) : (
                    <p>Email not provided</p>
                  )}
                </div>
                <div>
                  <span>☎</span>
                  <p>{supplier.phone || "Not provided"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/suppliers/${supplier._id}`)}
              >
                View Supplier
                <span>→</span>
              </button>
            </div>
          ) : (
            <div className={styles.noSupplier}>
              <span>♣</span>
              <strong>No Supplier Assigned</strong>
              <p>This product is not connected to a supplier.</p>
            </div>
          )}
        </article>
      </section>
      <section className={styles.bottomGrid}>
        <article className={styles.salesCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Recent Sales</h2>
              <p>Latest transactions for this product</p>
            </div>
            <span className={styles.sectionBadge}>
              {productSales.length} Transactions
            </span>
          </header>
          <div className={styles.salesList}>
            {productSales.length > 0 ? (
              productSales.slice(0, 5).map((sale) => (
                <div className={styles.saleRow} key={sale._id}>
                  <span className={styles.saleRowIcon}>🛒</span>
                  <div>
                    <strong>{sale.quantity} units sold</strong>
                    <small>{new Date(sale.date).toLocaleString("en-IN")}</small>
                  </div>
                  <section>
                    <strong>
                      ₹{Number(sale.revenue).toLocaleString("en-IN")}
                    </strong>
                    <small>Revenue</small>
                  </section>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <span>🛒</span>
                <strong>No Sales Recorded</strong>
                <p>This product does not have any sales transactions yet.</p>
              </div>
            )}
          </div>
          <div className={styles.salesSummary}>
            <div>
              <span>Total Units Sold</span>
              <strong>{unitsSold}</strong>
            </div>
            <div>
              <span>Total Revenue</span>
              <strong>₹{revenue.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </article>
        <article className={styles.movementCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Inventory Movements</h2>
              <p>Recent stock activity</p>
            </div>
            <span className={styles.sectionBadge}>
              {productLogs.length} Movements
            </span>
          </header>
          <div className={styles.movementList}>
            {productLogs.length > 0 ? (
              productLogs.slice(0, 6).map((log) => {
                const stockIn = log.type === "STOCK_IN";

                const adjustment = log.type === "ADJUSTMENT";

                const saleMovement = log.type === "SALE";

                const movementIcon = adjustment
                  ? "↻"
                  : stockIn
                    ? "↑"
                    : saleMovement
                      ? "🛒"
                      : "↓";

                const quantityPrefix = adjustment ? "" : stockIn ? "+" : "-";

                return (
                  <div className={styles.movementRow} key={log._id}>
                    <span
                      className={
                        stockIn ? styles.movementIn : styles.movementOut
                      }
                    >
                      {movementIcon}
                    </span>

                    <div>
                      <strong>{log.type.replace("_", " ")}</strong>

                      <small>
                        {new Date(log.date).toLocaleString("en-IN")}
                      </small>
                    </div>

                    <em>
                      {quantityPrefix}
                      {log.quantity}
                    </em>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <span>▣</span>
                <strong>No Inventory Movements</strong>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

export default ProductDetails;
