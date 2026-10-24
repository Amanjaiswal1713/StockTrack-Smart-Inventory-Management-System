import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.brand}>
          <span className={styles.logoIcon}>◆</span>

          <span className={styles.brandText}>
            <strong>
              Stock<span>Track</span>
            </strong>
            <small>Smart Inventory Management</small>
          </span>
        </Link>

        {/* Links */}
        <nav className={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Social / simple visual indicators */}
        <div className={styles.social}>
          <a>in</a>
          <a>X</a>
          <a>◎</a>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>© 2026 StockTrack. All rights reserved.</p>
          <span>Smarter Inventory. A Brighter Tomorrow.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
