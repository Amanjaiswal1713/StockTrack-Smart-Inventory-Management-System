import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import styles from "./SupplierDetails.module.css";

function SupplierDetails() {
  const { suppliers, suppliersLoading, products, productsLoading } =
    useContext(DataContext);
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const supplier = suppliers.find(
    (item) => String(item._id) === String(supplierId),
  );
  const suppliedProducts = products.filter(
    (product) => String(product.supplierId) === String(supplierId),
  );
  if (suppliersLoading || productsLoading) {
    return <div className={styles.notFound}>Loading supplier...</div>;
  }
  if (!supplier) {
    return (
      <div className={styles.notFound}>
        <span>♣</span>
        <h1>Supplier Not Found</h1>
        <p>The requested supplier does not exist or may have been deleted.</p>
        <button type="button" onClick={() => navigate("/suppliers")}>
          ← Back to Suppliers
        </button>
      </div>
    );
  }
  const totalUnits = suppliedProducts.reduce(
    (total, product) => total + Number(product.stock),
    0,
  );
  const inventoryValue = suppliedProducts.reduce(
    (total, product) => total + Number(product.stock) * Number(product.price),
    0,
  );
  const lowStockProducts = suppliedProducts.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= Number(product.minStock),
  );
  const outOfStockProducts = suppliedProducts.filter(
    (product) => Number(product.stock) === 0,
  );
  const getProductStatus = (product) => {
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
  const isActive = (supplier.status || "Active").toLowerCase() === "active";
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <button type="button" onClick={() => navigate("/suppliers")}>
            Suppliers
          </button>
          <span>›</span>
          <strong>{supplier.company}</strong>
        </div>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/suppliers")}
        >
          ← Back to Suppliers
        </button>
      </header>
      <section className={styles.supplierHero}>
        <div className={styles._identity}>
          <span className={styles.avatar}>
            {supplier.company?.charAt(0)?.toUpperCase() || "S"}
          </span>
          <div>
            <div className={styles.titleRow}>
              <h1>{supplier.company}</h1>
              <span
                className={`${styles.status} ${
                  isActive ? styles.active : styles.inactive
                }`}
              >
                <span />
                {supplier.status || "Active"}
              </span>
            </div>
            <p>
              Contact Person: <strong>{supplier.name}</strong>
            </p>
            <div className={styles.heroTags}>
              <span>♣ Supplier</span>
              <span>{suppliedProducts.length} Products</span>
            </div>
          </div>
        </div>
        <div className={styles.heroContact}>
          <span>Primary Contact</span>
          <strong>{supplier.name}</strong>
          <small>{supplier.email || "Email not provided"}</small>
        </div>
      </section>
      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.productIcon}>◆</span>
          <div>
            <p>Products Supplied</p>
            <strong>{suppliedProducts.length}</strong>
            <small>Assigned products</small>
          </div>
        </article>
        <article className={styles.statCard}>
          <span className={styles.unitsIcon}>▣</span>
          <div>
            <p>Total Stock Units</p>
            <strong>{totalUnits}</strong>
            <small>Current supplied inventory</small>
          </div>
        </article>
        <article className={styles.statCard}>
          <span className={styles.valueIcon}>₹</span>
          <div>
            <p>Inventory Value</p>
            <strong>₹{inventoryValue.toLocaleString("en-IN")}</strong>
            <small>Value of supplied stock</small>
          </div>
        </article>
        <article className={styles.statCard}>
          <span className={styles.warningIcon}>△</span>
          <div>
            <p>Stock Attention</p>
            <strong>
              {lowStockProducts.length + outOfStockProducts.length}
            </strong>
            <small>Low or unavailable products</small>
          </div>
        </article>
      </section>
      <section className={styles.informationGrid}>
        <article className={styles.contactCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Contact Information</h2>
              <p>Supplier communication details</p>
            </div>
            <span className={styles.contactIcon}>♣</span>
          </header>
          <div className={styles.contactList}>
            <div>
              <span className={styles.contactType}>♣</span>
              <section>
                <small>Contact Person</small>
                <strong>{supplier.name}</strong>
              </section>
            </div>
            <div>
              <span className={styles.emailIcon}>✉</span>
              <section>
                <small>Email Address</small>
                {supplier.email ? (
                  <a href={`mailto:${supplier.email}`}>{supplier.email}</a>
                ) : (
                  <strong>Not provided</strong>
                )}
              </section>
            </div>
            <div>
              <span className={styles.phoneIcon}>☎</span>
              <section>
                <small>Phone Number</small>
                {supplier.phone ? (
                  <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
                ) : (
                  <strong>Not provided</strong>
                )}
              </section>
            </div>
            <div>
              <span className={styles.companyIcon}>◆</span>
              <section>
                <small>Company</small>
                <strong>{supplier.company}</strong>
              </section>
            </div>
          </div>
        </article>
        <article className={styles.healthCard}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Supply Overview</h2>
              <p>Current product stock condition</p>
            </div>
            <span className={styles.healthIcon}>▥</span>
          </header>
          <div className={styles.healthStats}>
            <div>
              <span className={styles.greenDot} />
              <section>
                <small>Healthy Stock</small>
                <strong>
                  {suppliedProducts.length -
                    lowStockProducts.length -
                    outOfStockProducts.length}
                </strong>
              </section>
            </div>
            <div>
              <span className={styles.yellowDot} />
              <section>
                <small>Low Stock</small>
                <strong>{lowStockProducts.length}</strong>
              </section>
            </div>
            <div>
              <span className={styles.redDot} />
              <section>
                <small>Out of Stock</small>
                <strong>{outOfStockProducts.length}</strong>
              </section>
            </div>
          </div>
          <div className={styles.stockBar}>
            {suppliedProducts.length > 0 ? (
              <>
                <span
                  className={styles.greenSection}
                  style={{
                    width: `${
                      ((suppliedProducts.length -
                        lowStockProducts.length -
                        outOfStockProducts.length) /
                        suppliedProducts.length) *
                      100
                    }%`,
                  }}
                />
                <span
                  className={styles.yellowSection}
                  style={{
                    width: `${
                      (lowStockProducts.length / suppliedProducts.length) * 100
                    }%`,
                  }}
                />
                <span
                  className={styles.redSection}
                  style={{
                    width: `${
                      (outOfStockProducts.length / suppliedProducts.length) *
                      100
                    }%`,
                  }}
                />
              </>
            ) : null}
          </div>
        </article>
      </section>
      <section className={styles.productsCard}>
        <header className={styles.productsHeader}>
          <div>
            <h2>Products Supplied</h2>
            <p>Products currently assigned to {supplier.company}</p>
          </div>
          <span>{suppliedProducts.length} Products</span>
        </header>
        {suppliedProducts.length > 0 ? (
          <div className={styles.productTable}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Minimum</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliedProducts.map((product) => {
                  const productStatus = getProductStatus(product);
                  return (
                    <tr key={product._id}>
                      <td>
                        <div className={styles.productCell}>
                          <span>◆</span>
                          <strong>{product.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className={styles.sku}>{product.sku}</span>
                      </td>
                      <td>
                        <span className={styles.category}>
                          {product.category}
                        </span>
                      </td>
                      <td>₹{Number(product.price).toLocaleString("en-IN")}</td>
                      <td>
                        <strong>{product.stock}</strong>
                      </td>
                      <td>{product.minStock}</td>
                      <td>
                        <span
                          className={`${styles.productStatus} ${productStatus.className}`}
                        >
                          <span />
                          {productStatus.label}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => navigate(`/products/${product._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyProducts}>
            <span>◆</span>
            <h3>No Products Assigned</h3>
            <p>This supplier currently has no products assigned.</p>
            <button type="button" onClick={() => navigate("/products")}>
              View Products
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
export default SupplierDetails;
