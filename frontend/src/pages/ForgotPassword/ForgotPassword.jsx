import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className={styles.page}>
      <section className={styles.visualPanel}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>◆</span>

          <div className={styles.brandContent}>
            <strong>
              Stock<span>Track</span>
            </strong>

            <small>Smart Inventory Management</small>
          </div>
        </Link>

        <div className={styles.visualContent}>
          <span className={styles.eyebrow}>ACCOUNT RECOVERY</span>

          <h1>
            Forgot Your
            <br />
            <span>Password?</span>
          </h1>

          <p>
            No worries. Enter your registered email address and follow the
            instructions to recover access to your StockTrack account.
          </p>

          <div className={styles.steps}>
            <article>
              <span>1</span>

              <div>
                <strong>Enter Your Email</strong>
                <small>Use the email connected to your account.</small>
              </div>
            </article>

            <div className={styles.stepLine} />

            <article>
              <span>2</span>

              <div>
                <strong>Check Your Inbox</strong>
                <small>Look for the password reset instructions.</small>
              </div>
            </article>

            <div className={styles.stepLine} />

            <article>
              <span>3</span>

              <div>
                <strong>Reset Password</strong>
                <small>Create a new password and sign in again.</small>
              </div>
            </article>
          </div>

          <div className={styles.visual}>
            <div className={styles.envelope}>
              <span>✉</span>
            </div>

            <div className={styles.lockCard}>
              <div className={styles.lock}>▣</div>

              <strong>Secure Account Recovery</strong>

              <p>Your account security is important to us.</p>

              <div className={styles.securityBar}>
                <span />
              </div>
            </div>

            <span className={styles.plant}>🌱</span>

            <span className={styles.visualNote}>
              Back On Track
              <br />
              In No Time
            </span>
          </div>
        </div>

        <div className={styles.visualFooter}>
          <div>
            <span>◆</span>
            <strong>Secure</strong>
          </div>

          <div>
            <span>◷</span>
            <strong>Quick Recovery</strong>
          </div>

          <div>
            <span>♣</span>
            <strong>We're Here to Help</strong>
          </div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.backHome}>
          <Link to="/">← Back to Home</Link>
        </div>

        <div className={styles.resetCard}>
          <div className={styles.iconCircle}>✉</div>

          {!submitted ? (
            <>
              <header className={styles.cardHeader}>
                <h2>Forgot Password?</h2>

                <p>
                  Enter your registered email address and we'll help you reset
                  your password.
                </p>
              </header>

              <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                  <span>Email Address</span>

                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>✉</span>

                    <input
                      type="email"
                      value={email}
                      placeholder="Enter your email address"
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </label>

                <button type="submit" className={styles.resetButton}>
                  Send Reset Link
                  <span>→</span>
                </button>
              </form>

              <div className={styles.loginLink}>
                <span>Remember your password?</span>

                <Link to="/login">← Back to Login</Link>
              </div>
            </>
          ) : (
            <div className={styles.success}>
              <span className={styles.successIcon}>✓</span>

              <h2>Check Your Email</h2>

              <p>Reset instructions have been requested for:</p>

              <strong>{email}</strong>

              <button type="button" onClick={() => setSubmitted(false)}>
                Try Another Email
              </button>

              <Link to="/login">← Back to Login</Link>
            </div>
          )}

          {!submitted && (
            <div className={styles.helpBox}>
              <span className={styles.helpIcon}>◆</span>

              <div>
                <strong>Need Help?</strong>

                <p>
                  If you don't have access to your registered email, contact
                  StockTrack support.
                </p>

                <Link to="/contact">Contact Support →</Link>
              </div>
            </div>
          )}

          <div className={styles.securityMessage}>
            <span>▣</span>

            <div>
              <strong>Secure password recovery</strong>
              <small>Your account information remains protected.</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
