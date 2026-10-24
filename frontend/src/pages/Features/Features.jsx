import { Link } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import styles from "./Features.module.css";

const features = [
  {
    icon: "◇",
    title: "Product Management",
    description:
      "Add, update, delete and manage all your products with category, price and stock details.",
    variant: "blue",
  },
  {
    icon: "♣",
    title: "Supplier Management",
    description:
      "Maintain supplier information and track your purchase sources easily.",
    variant: "green",
  },
  {
    icon: "▤",
    title: "Inventory Management",
    description:
      "Track stock in real-time, manage stock in/out and view complete inventory history.",
    variant: "purple",
  },
  {
    icon: "🛒",
    title: "Sales Management",
    description:
      "Record sales, view transaction history and monitor revenue growth.",
    variant: "red",
  },
  {
    icon: "▥",
    title: "Smart Analytics",
    description:
      "Visualize key insights with interactive charts and reports for better decision making.",
    variant: "yellow",
  },
  {
    icon: "△",
    title: "Low Stock Alerts",
    description:
      "Get instant alerts for low stock items and never run out of essential products.",
    variant: "pink",
  },
  {
    icon: "●",
    title: "Smart Reorder Suggestions",
    description:
      "Receive intelligent suggestions on how much to reorder based on current stock and usage.",
    variant: "mint",
  },
  {
    icon: "◕",
    title: "Dead Stock Detection",
    description:
      "Identify slow-moving or inactive products and optimize your inventory.",
    variant: "violet",
  },
];

function Features() {
  return (
    <PublicLayout>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>FEATURES</span>

              <h1>
                Powerful Features for
                <br />
                <span>Smarter</span> Inventory Management
              </h1>

              <p>
                Everything you need to manage your stock, suppliers, sales and
                get intelligent insights, all in one simple and powerful
                platform.
              </p>
            </div>

            <div className={styles.heroVisual}>
              <span className={styles.handText}>
                Organize
                <br />
                Track
                <br />
                Grow
              </span>

              <div className={styles.shelf}>
                <div className={styles.shelfTop}>
                  <div className={styles.boxSmall} />
                  <div className={styles.boxTall} />
                  <div className={styles.boxMedium} />
                </div>

                <div className={styles.shelfLine} />

                <div className={styles.shelfBottom}>
                  <div className={styles.boxWide} />
                  <div className={styles.boxBottom} />
                </div>
              </div>

              <div className={styles.plant}>
                <span>☘</span>
              </div>

              <div className={styles.smartCard}>
                <span className={styles.smartIcon}>◆</span>

                <div>
                  <strong>Smarter Inventory</strong>
                  <span>Happier Business</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featureSection}>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article className={styles.featureCard} key={feature.title}>
                <span
                  className={`${styles.iconBox} ${styles[feature.variant]}`}
                >
                  {feature.icon}
                </span>

                <h2>{feature.title}</h2>

                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.cta}>
            <div className={styles.ctaContent}>
              <span className={styles.ctaEyebrow}>READY TO GET STARTED?</span>

              <h2>
                Manage Your Inventory <span>Smarter</span>
              </h2>

              <p>Simple. Powerful. Built for Your Business.</p>

              <Link to="/login" className={styles.ctaButton}>
                <span>●</span>
                Login to Dashboard
                <span>→</span>
              </Link>
            </div>

            <div className={styles.ctaVisual}>
              <span className={styles.ctaNote}>
                Efficiency today
                <br />
                Growth tomorrow
              </span>

              <div className={styles.miniStats}>
                <div className={styles.miniCard}>
                  <span className={styles.blueMini}>◆</span>

                  <div>
                    <small>Total Products</small>
                    <strong>120</strong>
                    <em>↑ 12%</em>
                  </div>
                </div>

                <div className={styles.miniCard}>
                  <span className={styles.greenMini}>▥</span>

                  <div>
                    <small>Total Sales</small>
                    <strong>256</strong>
                    <em>↑ 8%</em>
                  </div>
                </div>
              </div>

              <div className={styles.stockCard}>
                <div className={styles.stockHeader}>
                  <strong>Stock Overview</strong>
                  <span>This Month ⌄</span>
                </div>

                <div className={styles.barChart}>
                  <span className={styles.barGreenOne} />
                  <span className={styles.barGreenTwo} />
                  <span className={styles.barBlue} />
                  <span className={styles.barGreenThree} />
                  <span className={styles.barGreenFour} />
                  <span className={styles.barBlueTwo} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export default Features;
