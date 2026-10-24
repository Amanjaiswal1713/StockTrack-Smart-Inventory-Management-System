import { Link } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import styles from "./Home.module.css";

const features = [
  {
    icon: "▣",
    title: "Product Management",
    text: "Add, update and track products effortlessly.",
    color: "blue",
  },
  {
    icon: "♟",
    title: "Supplier Management",
    text: "Manage supplier details in one place.",
    color: "green",
  },
  {
    icon: "▤",
    title: "Stock Tracking",
    text: "Real-time stock monitoring and low-stock alerts.",
    color: "yellow",
  },
  {
    icon: "🛒",
    title: "Sales Management",
    text: "Record sales and view complete history.",
    color: "red",
  },
  {
    icon: "▥",
    title: "Smart Analytics",
    text: "Visual insights for better decision making.",
    color: "purple",
  },
  {
    icon: "◷",
    title: "Dead Stock Detection",
    text: "Identify slow-moving or inactive products.",
    color: "cyan",
  },
];

function Home() {
  return (
    <PublicLayout>
      <main className={styles.home}>
        <section className={styles.hero}>
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>
                SMART INVENTORY MANAGEMENT SYSTEM
              </span>

              <h1>
                Take Control of
                <br />
                Your <span>Inventory</span>
              </h1>

              <p className={styles.heroDescription}>
                Track stock, manage suppliers, monitor sales, and make smarter
                decisions, all in one powerful platform.
              </p>

              <div className={styles.heroActions}>
                <Link to="/login" className={styles.primaryButton}>
                  Login to Dashboard
                  <span>→</span>
                </Link>

                <Link to="/features" className={styles.secondaryButton}>
                  Explore Features
                </Link>
              </div>

              <div className={styles.benefits}>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>◆</span>
                  <div>
                    <strong>Secure & Reliable</strong>
                    <small>Your data is safe with us</small>
                  </div>
                </div>

                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>ϟ</span>
                  <div>
                    <strong>Smart Insights</strong>
                    <small>Turn data into decisions</small>
                  </div>
                </div>

                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>▥</span>
                  <div>
                    <strong>Efficient Management</strong>
                    <small>Save time, reduce costs</small>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.decorativeText}>
                Smarter Stock
                <br />
                Brighter Tomorrow
              </div>

              <div className={styles.dashboardPreview}>
                <div className={styles.previewHeader}>
                  <strong>Inventory Overview</strong>

                  <span>This Month⌄</span>
                </div>

                <div className={styles.previewStats}>
                  <div className={styles.previewStat}>
                    <span className={styles.blueIcon}>◆</span>
                    <strong>120</strong>
                    <small>Total Products</small>
                  </div>

                  <div className={styles.previewStat}>
                    <span className={styles.greenIcon}>▣</span>
                    <strong>45</strong>
                    <small>Total Sales</small>
                  </div>

                  <div className={styles.previewStat}>
                    <span className={styles.yellowIcon}>♟</span>
                    <strong>18</strong>
                    <small>Suppliers</small>
                  </div>

                  <div className={styles.previewStat}>
                    <span className={styles.redIcon}>△</span>
                    <strong>5</strong>
                    <small>Low Stock Items</small>
                  </div>
                </div>

                <div className={styles.chartArea}>
                  <div className={styles.chartTitle}>Monthly Sales</div>

                  <div className={styles.chart}>
                    <div className={styles.gridLine} />
                    <div className={styles.gridLine} />
                    <div className={styles.gridLine} />

                    <div className={styles.chartBars}>
                      <span style={{ height: "24%" }} />
                      <span style={{ height: "37%" }} />
                      <span style={{ height: "51%" }} />
                      <span style={{ height: "44%" }} />
                      <span style={{ height: "66%" }} />
                      <span style={{ height: "59%" }} />
                      <span style={{ height: "82%" }} />
                    </div>
                  </div>
                </div>

                <div className={styles.healthCard}>
                  <span>Inventory Health</span>

                  <div className={styles.healthCircle}>
                    <div>
                      <strong>85%</strong>
                    </div>
                  </div>

                  <small>Good ↗</small>
                </div>
              </div>

              <div className={styles.warehouseShape}>
                <div className={styles.boxOne} />
                <div className={styles.boxTwo} />
                <div className={styles.boxThree} />
                <div className={styles.plant}>
                  <span>🌿</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.sectionHeading}>
            <span>WHY CHOOSE STOCKTRACK</span>

            <h2>
              Everything You Need to <em>Manage Inventory</em>
            </h2>

            <p>
              Simple. Smart. Powerful. Designed for businesses of all sizes.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article className={styles.featureCard} key={feature.title}>
                <span
                  className={`${styles.featureIcon} ${styles[feature.color]}`}
                >
                  {feature.icon}
                </span>

                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaWrapper}>
          <div className={styles.cta}>
            <div className={styles.ctaLeaf}>🌱</div>

            <div className={styles.ctaContent}>
              <h2>
                Manage Smarter. Grow <span>Faster.</span>
              </h2>

              <p>
                Start using StockTrack today and bring efficiency to your
                inventory management.
              </p>
            </div>

            <Link to="/login" className={styles.ctaButton}>
              Login Now
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export default Home;
