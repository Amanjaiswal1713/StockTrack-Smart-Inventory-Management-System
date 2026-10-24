import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const { fullName, username, email, password, confirmPassword, phone } =
      formData;

    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("All required fields must be completed");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must contain at least 3 characters");
      return;
    }

    const usernamePattern = /^[a-zA-Z0-9_]+$/;

    if (!usernamePattern.test(username.trim())) {
      setError("Username can contain only letters, numbers and underscores");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms & Conditions and Privacy Policy");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await register({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          registrationMessage:
            "Registration successful. Please login to StockTrack.",
        },
      });
    } catch (registrationError) {
      setError(registrationError.message || "Unable to create account");
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
          <span className={styles.eyebrow}>JOIN STOCKTRACK</span>

          <h1>
            Start Managing
            <br />
            <span>Smarter Today</span>
          </h1>

          <p>
            Create your account and take control of your inventory, suppliers
            and sales, all in one place.
          </p>

          <span className={styles.handText}>
            Small
            <br />
            Steps
            <br />
            Big
            <br />
            Growth
          </span>

          <div className={styles.benefits}>
            <article>
              <span className={styles.greenBenefit}>◆</span>

              <strong>
                Organize
                <br />
                Inventory
              </strong>
            </article>

            <article>
              <span className={styles.blueBenefit}>▥</span>

              <strong>
                Track
                <br />
                Performance
              </strong>
            </article>

            <article>
              <span className={styles.yellowBenefit}>●</span>

              <strong>
                Avoid
                <br />
                Stockouts
              </strong>
            </article>

            <article>
              <span className={styles.purpleBenefit}>♣</span>

              <strong>
                Grow
                <br />
                Your Business
              </strong>
            </article>
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

            <div className={styles.mockMain}>
              <div className={styles.mockStats}>
                <article>
                  <span className={styles.blueBox}>◆</span>

                  <div>
                    <small>Total Products</small>
                    <strong>120</strong>
                  </div>
                </article>

                <article>
                  <span className={styles.greenBox}>▥</span>

                  <div>
                    <small>Total Sales</small>
                    <strong>256</strong>
                  </div>
                </article>

                <article>
                  <span className={styles.yellowBox}>△</span>

                  <div>
                    <small>Low Stock</small>
                    <strong>25</strong>
                  </div>
                </article>
              </div>

              <section className={styles.mockChartPanel}>
                <div className={styles.mockHeading}>
                  <strong>Sales Overview</strong>
                  <span>This Month</span>
                </div>

                <div className={styles.chartArea}>
                  <span className={styles.gridOne} />
                  <span className={styles.gridTwo} />
                  <span className={styles.gridThree} />

                  <svg
                    viewBox="0 0 500 100"
                    preserveAspectRatio="none"
                    className={styles.chartSvg}
                  >
                    <polyline
                      points="0,72 60,54 120,66 185,42 250,58 318,35 390,46 500,20"
                      fill="none"
                      stroke="#12a46d"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </section>

              <div className={styles.mockBottom}>
                <article>
                  <strong>Inventory Status</strong>

                  <div className={styles.donut}>
                    <span />
                  </div>
                </article>

                <article>
                  <strong>Recent Activity</strong>

                  <div className={styles.activity}>
                    <span className={styles.activityGreen}>◆</span>
                    New product added
                  </div>

                  <div className={styles.activity}>
                    <span className={styles.activityYellow}>●</span>
                    Sale recorded
                  </div>

                  <div className={styles.activity}>
                    <span className={styles.activityBlue}>▣</span>
                    Stock updated
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
            <strong>Improve Efficiency</strong>
          </div>

          <div>
            <span>▥</span>
            <strong>Build a Smarter Business</strong>
          </div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.topAction}>
          <span>Already have an account?</span>

          <Link to="/login">
            <span>→</span>
            Login
          </Link>
        </div>

        <div className={styles.registerCard}>
          <header className={styles.cardHeader}>
            <h2>Create Your Account</h2>

            <p>
              Join StockTrack and get started with smarter inventory management.
            </p>
          </header>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.twoColumns}>
              <label>
                <span>Full Name</span>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>♟</span>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </label>

              <label>
                <span>Username</span>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>♟</span>

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Enter your username"
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>
              </label>

              <label>
                <span>Email Address</span>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>✉</span>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </label>
            </div>

            <div className={styles.twoColumns}>
              <label>
                <span>Password</span>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>▣</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="Create a password"
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className={styles.passwordButton}
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "◉" : "◎"}
                  </button>
                </div>
              </label>

              <label>
                <span>Confirm Password</span>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>▣</span>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="Confirm your password"
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className={styles.passwordButton}
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? "◉" : "◎"}
                  </button>
                </div>
              </label>
            </div>

            <label>
              <span>
                Phone Number <small>(Optional)</small>
              </span>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>☎</span>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </label>

            <label className={styles.terms}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />

              <span>
                I agree to the <button type="button">Terms & Conditions</button>{" "}
                and <button type="button">Privacy Policy</button>
              </span>
            </label>

            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={styles.createButton}
            >
              <span>♣</span>
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className={styles.divider}>
            <span />
            <small>or</small>
            <span />
          </div>

          <div className={styles.whyJoin}>
            <span className={styles.shieldIcon}>◆</span>

            <div>
              <strong>Why Join StockTrack?</strong>

              <ul>
                <li>Manage your inventory efficiently</li>
                <li>Track sales and suppliers</li>
                <li>Get real-time insights</li>
                <li>Grow your business</li>
              </ul>
            </div>
          </div>

          <div className={styles.mobileLogin}>
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
