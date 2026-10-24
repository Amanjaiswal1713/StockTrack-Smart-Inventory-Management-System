import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await login({
        email: formData.email.trim().toLowerCase(),

        password: formData.password,
      });

      const destination = location.state?.from?.pathname || "/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (loginError) {
      setError(loginError.message || "Unable to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.visualPanel}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>◆</span>

          <div>
            <strong>
              Stock<span>Track</span>
            </strong>

            <small>Smart Inventory Management</small>
          </div>
        </Link>

        <div className={styles.visualContent}>
          <span className={styles.handText}>
            Organize
            <br />
            Track
            <br />
            Grow
          </span>

          <h1>
            Smarter Inventory
            <br />
            <span>Brighter Tomorrow</span>
          </h1>

          <p>
            Take control of your stock, suppliers and sales with a simple,
            powerful and intelligent inventory management system.
          </p>

          <div className={styles.benefits}>
            <div>
              <span className={styles.greenIcon}>◆</span>

              <strong>
                Real-time
                <br />
                Inventory Tracking
              </strong>
            </div>

            <div>
              <span className={styles.blueIcon}>▥</span>

              <strong>
                Smart
                <br />
                Analytics
              </strong>
            </div>

            <div>
              <span className={styles.yellowIcon}>●</span>

              <strong>
                Low Stock
                <br />
                Monitoring
              </strong>
            </div>

            <div>
              <span className={styles.purpleIcon}>▣</span>

              <strong>
                Sales
                <br />
                Insights
              </strong>
            </div>
          </div>

          <div className={styles.dashboardMockup}>
            <div className={styles.mockSidebar}>
              <strong>
                ◆ Stock<span>Track</span>
              </strong>

              <div className={styles.activeMenu}>▦ Dashboard</div>
              <div>◆ Products</div>
              <div>♣ Suppliers</div>
              <div>▣ Inventory</div>
              <div>▤ Sales</div>
              <div>▥ Analytics</div>
            </div>

            <div className={styles.mockContent}>
              <div className={styles.mockStats}>
                <article>
                  <span className={styles.blueBox}>◆</span>

                  <div>
                    <small>Total Products</small>
                    <strong>120</strong>
                  </div>
                </article>

                <article>
                  <span className={styles.greenBox}>▣</span>

                  <div>
                    <small>Total Sales</small>
                    <strong>256</strong>
                  </div>
                </article>
              </div>

              <div className={styles.mockChartPanel}>
                <div className={styles.mockPanelHeading}>
                  <strong>Sales Overview</strong>
                  <span>This Month</span>
                </div>

                <div className={styles.lineChart}>
                  <div className={styles.chartGridOne} />
                  <div className={styles.chartGridTwo} />
                  <div className={styles.chartGridThree} />

                  <svg
                    viewBox="0 0 500 100"
                    preserveAspectRatio="none"
                    className={styles.chartSvg}
                  >
                    <polyline
                      points="0,75 65,55 125,66 195,43 260,58 330,37 395,46 500,20"
                      fill="none"
                      stroke="#16a36c"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>

              <div className={styles.mockBottom}>
                <article>
                  <strong>Stock Status</strong>

                  <div className={styles.mockDonut}>
                    <span />
                  </div>
                </article>

                <article>
                  <strong>Top Products</strong>

                  <div className={styles.productRow}>
                    <span>1</span>
                    Laptop
                  </div>

                  <div className={styles.productRow}>
                    <span>2</span>
                    Wireless Mouse
                  </div>

                  <div className={styles.productRow}>
                    <span>3</span>
                    Keyboard
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.visualFooter}>
          <div>
            <span>🌱</span>
            <strong>Save Time</strong>
          </div>

          <div>
            <span>⚙</span>
            <strong>Reduce Costs</strong>
          </div>

          <div>
            <span>▥</span>
            <strong>Grow Faster</strong>
          </div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.topAction}>
          <span>New here?</span>

          <Link to="/">← Back to Home</Link>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.cardLogo}>◆</div>

          <h2>Welcome Back! 👋</h2>

          <p className={styles.subtitle}>Login to your account</p>

          <p className={styles.intro}>
            Manage your inventory, suppliers, sales and more, all in one place.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              <span>Email Address</span>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>✉</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </label>

            <label>
              <span>Password</span>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>▣</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className={styles.passwordButton}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "◉" : "◎"}
                </button>
              </div>
            </label>

            <div className={styles.formOptions}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />

                <span>Remember me</span>
              </label>

              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={styles.signInButton}
            >
              <span>→</span>
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className={styles.divider}>
            <span />
            <small>or</small>
            <span />
          </div>

          <div className={styles.registerLink}>
            <span>Don&apos;t have an account?</span>

            <Link to="/register">Create Account</Link>
          </div>

          <div className={styles.security}>
            <span>▣</span>

            <div>
              <strong>Protected with secure authentication</strong>
              <small>Your data is safe with us.</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
