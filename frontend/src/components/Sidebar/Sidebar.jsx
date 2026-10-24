import { NavLink, useNavigate } from "react-router-dom";
import { sidebarLinks } from "../../constants/navigation";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../hooks/useAuth";

const linkIcons = {
  "/dashboard": "⌂",
  "/products": "◆",
  "/suppliers": "♣",
  "/inventory": "▣",
  "/inventory-logs": "≡",
  "/sales": "🛒",
  "/analytics": "▥",
  "/low-stock": "△",
  "/dead-stock": "⊗",
  "/reports": "▤",
  "/settings": "⚙",
};

function Sidebar({ open, closeSidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <aside
      className={`${styles.sidebar} ${open ? styles.open : ""}`}
      aria-label="Dashboard navigation"
    >
      <div className={styles.brand}>
        <span className={styles.logoMark}>
          <span>◆</span>
        </span>

        <div className={styles.brandText}>
          <strong>
            Stock<span>Track</span>
          </strong>
          <small>Smarter Inventory. Better Business.</small>
        </div>

        <button
          type="button"
          className={styles.closeButton}
          onClick={closeSidebar}
          aria-label="Close navigation"
        >
          ×
        </button>
      </div>

      <nav className={styles.navigation}>
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.linkIcon} aria-hidden="true">
              {linkIcons[link.path] ?? "•"}
            </span>

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottomArea}>
        <div className={styles.tagline}>
          <span className={styles.leaf}>🌱</span>
          <p>
            Organize Today
            <br />
            Grow Tomorrow
          </p>
          <span className={styles.taglineLine} />
        </div>

        <button type="button" className={styles.logout} onClick={handleLogout}>
          <span aria-hidden="true">↪</span>
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
