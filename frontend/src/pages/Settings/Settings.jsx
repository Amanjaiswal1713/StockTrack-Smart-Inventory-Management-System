import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { DataContext } from "../../context/DataContext";
import styles from "./Settings.module.css";

function Settings() {
  const { user, updatePreferences, updatePassword } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(DataContext);
  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || "A";
  const preferences = user?.preferences || {
    darkMode: false,
    notifications: true,
    lowStockAlerts: true,
    salesAlerts: true,
    compactTables: false,
  };
  const updatePreference = async (preference, value) => {
    try {
      await updatePreferences({
        [preference]: value,
      });
    } catch {
      // error
    }
  };
  const [activeSection, setActiveSection] = useState("profile");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordSaving, setPasswordSaving] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));

    setPasswordError("");
  };
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Complete all password fields.");

      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");

      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must contain at least 8 characters.");

      return;
    }

    try {
      setPasswordSaving(true);

      setPasswordError("");

      await updatePassword(passwordForm);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch (error) {
      setPasswordError(error.message || "Unable to change password");
    } finally {
      setPasswordSaving(false);
    }
  };
  const openSection = (section) => {
    setActiveSection(section);

    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Settings</h1>

          <p>Manage your profile, appearance and application preferences.</p>
        </div>

        <span className={styles.statusBadge}>
          <span />
          Account Active
        </span>
      </header>

      <section className={styles.settingsGrid}>
        <aside className={styles.settingsNavigation}>
          <div className={styles.profilePreview}>
            <span className={styles.avatar}>{userInitial}</span>

            <div>
              <strong>{user?.fullName || "Admin"}</strong>

              <small>{user?.email || "admin@stocktrack.com"}</small>
            </div>
          </div>

          <nav>
            <button
              type="button"
              id="profile"
              className={styles.activeNavigation}
              onClick={() => openSection("profile")}
            >
              <span>♣</span>
              Profile
            </button>

            <button
              type="button"
              id="appearance"
              onClick={() => openSection("appearance")}
            >
              <span>◐</span>
              Appearance
            </button>

            <button
              type="button"
              id="notifications"
              onClick={() => openSection("notifications")}
            >
              <span>♢</span>
              Notifications
            </button>

            <button
              type="button"
              id="preferences"
              onClick={() => openSection("preferences")}
            >
              <span>▣</span>
              Preferences
            </button>

            <button
              type="button"
              id="security"
              onClick={() => openSection("security")}
            >
              <span>◆</span>
              Security
            </button>
          </nav>

          <div className={styles.navigationFooter}>
            <span>🌱</span>

            <div>
              <strong>StockTrack</strong>
              <small>Smart Inventory Management</small>
            </div>
          </div>
        </aside>

        <div className={styles.settingsContent}>
          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2>Profile</h2>

                <p>Manage your account information and personal details.</p>
              </div>

              <span className={styles.profileIcon}>♣</span>
            </header>

            <div className={styles.profileSection}>
              <span className={styles.largeAvatar}>{userInitial}</span>

              <div className={styles.profileDetails}>
                <div>
                  <span>Full Name</span>

                  <strong>
                    {user?.fullName || user?.username || "StockTrack User"}
                  </strong>
                </div>

                <div>
                  <span>Email Address</span>

                  <strong>{user?.email || "admin@stocktrack.com"}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2>Appearance</h2>

                <p>Customize how StockTrack looks on your screen.</p>
              </div>

              <span className={styles.appearanceIcon}>◐</span>
            </header>

            <div className={styles.themeCards}>
              <button
                type="button"
                className={`${styles.themeCard} ${
                  !darkMode ? styles.selectedTheme : ""
                }`}
                onClick={() => {
                  if (darkMode) {
                    toggleDarkMode();
                  }
                }}
              >
                <div className={styles.lightPreview}>
                  <span />

                  <section>
                    <i />
                    <i />
                    <i />
                  </section>
                </div>

                <div className={styles.themeInformation}>
                  <section>
                    <strong>Light Mode</strong>
                    <small>Bright dashboard appearance</small>
                  </section>

                  {!darkMode && <span className={styles.check}>✓</span>}
                </div>
              </button>

              <button
                type="button"
                className={`${styles.themeCard} ${
                  darkMode ? styles.selectedTheme : ""
                }`}
                onClick={() => {
                  if (!darkMode) {
                    toggleDarkMode();
                  }
                }}
              >
                <div className={styles.darkPreview}>
                  <span />

                  <section>
                    <i />
                    <i />
                    <i />
                  </section>
                </div>

                <div className={styles.themeInformation}>
                  <section>
                    <strong>Dark Mode</strong>
                    <small>Dark dashboard appearance</small>
                  </section>

                  {darkMode && <span className={styles.check}>✓</span>}
                </div>
              </button>
            </div>

            <div className={styles.themeStatus}>
              <div>
                <span
                  className={
                    darkMode ? styles.darkStatusIcon : styles.lightStatusIcon
                  }
                >
                  {darkMode ? "●" : "☀"}
                </span>

                <section>
                  <strong>Current Theme</strong>

                  <small>
                    {darkMode
                      ? "Dark Mode is enabled"
                      : "Light Mode is enabled"}
                  </small>
                </section>
              </div>

              <button type="button" onClick={toggleDarkMode}>
                Switch to {darkMode ? "Light" : "Dark"} Mode
              </button>
            </div>
          </section>

          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2>Notifications</h2>

                <p>Choose which application alerts you want to receive.</p>
              </div>

              <span className={styles.notificationIcon}>♢</span>
            </header>

            <div className={styles.preferenceList}>
              <div className={styles.preference}>
                <span className={styles.preferenceGreen}>♢</span>

                <div>
                  <strong>Application Notifications</strong>

                  <small>Enable general StockTrack alerts.</small>
                </div>

                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(event) =>
                      updatePreference("notifications", event.target.checked)
                    }
                  />

                  <span />
                </label>
              </div>

              <div className={styles.preference}>
                <span className={styles.preferenceOrange}>△</span>

                <div>
                  <strong>Low Stock Alerts</strong>

                  <small>
                    Show alerts when stock reaches the configured minimum.
                  </small>
                </div>

                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={preferences.lowStockAlerts}
                    onChange={(event) =>
                      updatePreference("lowStockAlerts", event.target.checked)
                    }
                  />

                  <span />
                </label>
              </div>

              <div className={styles.preference}>
                <span className={styles.preferenceBlue}>🛒</span>

                <div>
                  <strong>Sales Alerts</strong>

                  <small>Show notifications for sales activity.</small>
                </div>

                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={preferences.salesAlerts}
                    onChange={(event) =>
                      updatePreference("salesAlerts", event.target.checked)
                    }
                  />

                  <span />
                </label>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2>Display Preferences</h2>

                <p>Customize your dashboard viewing experience.</p>
              </div>

              <span className={styles.preferencesIcon}>▣</span>
            </header>

            <div className={styles.preference}>
              <span className={styles.preferencePurple}>≡</span>

              <div>
                <strong>Compact Tables</strong>

                <small>
                  Reduce table spacing to display more rows on screen.
                </small>
              </div>

              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={preferences.compactTables}
                  onChange={(event) =>
                    updatePreference("compactTables", event.target.checked)
                  }
                />

                <span />
              </label>
            </div>
          </section>

          <section className={styles.securityCard}>
            <div className={styles.securityIcon}>◆</div>

            <div>
              <span>ACCOUNT SECURITY</span>

              <h2>Change Password</h2>

              <p>Update your StockTrack account password.</p>

              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  placeholder="Current password"
                  onChange={handlePasswordChange}
                />

                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  placeholder="New password"
                  onChange={handlePasswordChange}
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  placeholder="Confirm new password"
                  onChange={handlePasswordChange}
                />

                {passwordError && <p role="alert">{passwordError}</p>}

                <button type="submit" disabled={passwordSaving}>
                  {passwordSaving ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default Settings;
