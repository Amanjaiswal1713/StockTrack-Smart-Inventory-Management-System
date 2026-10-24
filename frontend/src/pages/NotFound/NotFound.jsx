import { Link, useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <div className={styles.backgroundCircleOne} />
      <div className={styles.backgroundCircleTwo} />

      <section className={styles.card}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>◆</span>

          <div>
            <strong>
              Stock<span>Track</span>
            </strong>

            <small>Smart Inventory Management</small>
          </div>
        </Link>

        <div className={styles.illustration}>
          <div className={styles.number}>
            <span>4</span>

            <div className={styles.box}>
              <span>◆</span>
            </div>

            <span>4</span>
          </div>

          <div className={styles.shadow} />
        </div>

        <span className={styles.errorLabel}>PAGE NOT FOUND</span>

        <h1>Oops! This Page Is Missing</h1>

        <p className={styles.description}>
          The page you are looking for may have been moved, deleted, or the
          address may be incorrect.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>

          <Link to="/" className={styles.homeButton}>
            <span>⌂</span>
            Back to Home
          </Link>
        </div>

        <div className={styles.divider}>
          <span />
          <small>or explore</small>
          <span />
        </div>

        <div className={styles.links}>
          <Link to="/">
            <span>⌂</span>
            Home
          </Link>

          <Link to="/features">
            <span>◆</span>
            Features
          </Link>

          <Link to="/about">
            <span>♣</span>
            About
          </Link>

          <Link to="/contact">
            <span>✉</span>
            Contact
          </Link>
        </div>

        <div className={styles.help}>
          <span>🌱</span>

          <div>
            <strong>Need Help?</strong>

            <p>
              Contact StockTrack support if you believe this page should exist.
            </p>
          </div>

          <Link to="/contact">Contact Support →</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© 2026 StockTrack</span>

        <span>Smarter Inventory. Better Business.</span>
      </footer>
    </main>
  );
}

export default NotFound;
