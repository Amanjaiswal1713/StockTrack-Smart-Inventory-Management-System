import { useContext, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
  const { lowStockProducts, outOfStockProducts } = useContext(DataContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || "A";

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const stockAlertCount = lowStockProducts.length + outOfStockProducts.length;
  const handleSearch = (event) => {
    event.preventDefault();

    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return;
    }

    if (normalizedQuery.includes("product")) {
      navigate("/products");
      return;
    }

    if (normalizedQuery.includes("supplier")) {
      navigate("/suppliers");
      return;
    }

    if (normalizedQuery.includes("inventory")) {
      navigate("/inventory");
      return;
    }

    if (normalizedQuery.includes("sale")) {
      navigate("/sales");
      return;
    }

    if (normalizedQuery.includes("analytic")) {
      navigate("/analytics");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className={styles.layout}>
      <Sidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              ☰
            </button>

            <form className={styles.searchForm} onSubmit={handleSearch}>
              <span className={styles.searchIcon} aria-hidden="true">
                ⌕
              </span>

              <input
                type="search"
                value={searchQuery}
                placeholder="Search products, suppliers, or anything..."
                aria-label="Search dashboard"
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </form>
          </div>

          <div className={styles.accountArea}>
            <button
              type="button"
              className={styles.notificationButton}
              aria-label="Notifications"
              onClick={() => navigate("/low-stock")}
            >
              ♧{stockAlertCount > 0 && <span>{stockAlertCount}</span>}
            </button>

            <button
              type="button"
              className={styles.profileButton}
              onClick={() => navigate("/settings")}
              aria-label="Open settings"
            >
              <span className={styles.avatar}>{userInitial}</span>

              <span className={styles.accountText}>
                <strong>{user?.fullName || "Admin"}</strong>
                <small>{user?.email || "admin@stocktrack.com"}</small>
              </span>

              <span className={styles.chevron}>⌄</span>
            </button>

            <button
              type="button"
              className={styles.topLogout}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
