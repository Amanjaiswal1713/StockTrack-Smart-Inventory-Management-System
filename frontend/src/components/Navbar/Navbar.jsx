import { NavLink, Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <span className={styles.logoIcon}>
            <span className={styles.cube}>◆</span>
          </span>

          <span className={styles.brandText}>
            <strong>
              Stock<span>Track</span>
            </strong>
            <small>Smart Inventory Management</small>
          </span>
        </Link>

        {/* Navigation */}
        <div className={styles.navigation}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/features"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Features
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/login" className={styles.login}>
            Login
          </Link>

          <Link to="/register" className={styles.register}>
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
