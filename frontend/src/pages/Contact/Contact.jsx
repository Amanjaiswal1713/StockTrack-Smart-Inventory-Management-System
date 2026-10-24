import { useState } from "react";
import PublicLayout from "../../layouts/PublicLayout";
import styles from "./Contact.module.css";

const faqs = [
  "How can I get support if I face an issue?",
  "Can I request a new feature?",
  "How long does it take to get a response?",
  "Is StockTrack suitable for small businesses?",
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };
  const officeLocation = "M6WH+QF5 Yusufpur Dighikhurd, Bihar";

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    officeLocation,
  )}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    officeLocation,
  )}`;

  return (
    <PublicLayout>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>CONTACT US</span>

              <h1>
                We&apos;re Here to <span>Help!</span>
              </h1>

              <p>
                Have questions, suggestions, or need support? Get in touch with
                us. We&apos;d love to hear from you and help you make the most
                of StockTrack.
              </p>

              <div className={styles.supportItems}>
                <div className={styles.supportItem}>
                  <span className={styles.supportGreen}>◉</span>

                  <div>
                    <strong>Quick Support</strong>
                    <small>Get help when you need it</small>
                  </div>
                </div>

                <div className={styles.supportItem}>
                  <span className={styles.supportBlue}>●</span>

                  <div>
                    <strong>Expert Guidance</strong>
                    <small>Talk to our team</small>
                  </div>
                </div>

                <div className={styles.supportItem}>
                  <span className={styles.supportPurple}>♣</span>

                  <div>
                    <strong>Feedback Welcome</strong>
                    <small>Help us improve</small>
                  </div>
                </div>

                <div className={styles.supportItem}>
                  <span className={styles.supportYellow}>◆</span>

                  <div>
                    <strong>Reliable Assistance</strong>
                    <small>We&apos;re always here</small>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.paperPlane}>➤</div>
              <div className={styles.envelope}>✉</div>

              <div className={styles.messageCard}>
                <strong>
                  Let&apos;s
                  <br />
                  Build Smarter
                  <br />
                  Businesses
                  <br />
                  Together
                </strong>

                <span />
              </div>

              <div className={styles.plant}>♣</div>

              <div className={styles.handText}>
                Your
                <br />
                Feedback
                <br />
                Matters!
              </div>
            </div>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.contactGrid}>
            <div className={styles.messagePanel}>
              <div className={styles.panelHeading}>
                <h2>Send Us a Message</h2>

                <p>
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.twoColumns}>
                  <label>
                    <span>
                      Full Name <strong>*</strong>
                    </span>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      placeholder="Enter your full name"
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    <span>
                      Email Address <strong>*</strong>
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      placeholder="Enter your email address"
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>

                <label>
                  <span>
                    Subject <strong>*</strong>
                  </span>

                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="support">Technical Support</option>
                    <option value="product">Product Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label>
                  <span>
                    Message <strong>*</strong>
                  </span>

                  <textarea
                    name="message"
                    value={form.message}
                    rows="6"
                    maxLength="500"
                    placeholder="Type your message here..."
                    onChange={handleChange}
                    required
                  />

                  <small className={styles.counter}>
                    {form.message.length}/500
                  </small>
                </label>

                <button className={styles.submitButton} type="submit">
                  <span>➤</span>
                  Send Message
                </button>

                {submitted && (
                  <p className={styles.successMessage}>
                    Message submitted successfully.
                  </p>
                )}
              </form>

              <div className={styles.growTogether}>
                <span className={styles.groupIcon}>♣</span>

                <div>
                  <strong>Let&apos;s Grow Together</strong>
                  <p>
                    Your success is our priority. Thank you for being part of
                    the StockTrack community!
                  </p>
                </div>

                <span className={styles.growPlant}>🌱</span>
              </div>
            </div>

            <div className={styles.informationColumn}>
              <div className={styles.informationPanel}>
                <div className={styles.panelHeading}>
                  <h2>Contact Information</h2>

                  <p>Reach out to us through any of the following channels.</p>
                </div>

                <div className={styles.infoGrid}>
                  <article className={`${styles.infoCard} ${styles.phoneCard}`}>
                    <span className={styles.infoIcon}>●</span>
                    <strong>Phone</strong>
                    <p>+91 8864024703</p>
                    <small>Mon - Fri, 9AM - 6PM</small>
                  </article>

                  <article className={`${styles.infoCard} ${styles.emailCard}`}>
                    <span className={styles.infoIcon}>✉</span>
                    <strong>Email</strong>
                    <p>support@stocktrack.com</p>
                    <small>We reply within 24 hours</small>
                  </article>

                  <article
                    className={`${styles.infoCard} ${styles.officeCard}`}
                  >
                    <span className={styles.infoIcon}>●</span>
                    <strong>Office Address</strong>
                    <p>StockTrack Business Centre</p>
                    <small>India</small>
                  </article>

                  <article className={`${styles.infoCard} ${styles.hoursCard}`}>
                    <span className={styles.infoIcon}>◷</span>
                    <strong>Business Hours</strong>
                    <p>Monday - Friday</p>
                    <small>9:00 AM - 6:00 PM</small>
                  </article>
                </div>

                <div className={styles.visitPanel}>
                  <div className={styles.mapContainer}>
                    <iframe
                      className={styles.mapFrame}
                      src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d449.4033420395779!2d85.2286283!3d25.6969159!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDQxJzQ4LjgiTiA4NcKwMTMnNDMuNSJF!5e0!3m2!1sen!2sin!4v1792771545111!5m2!1sen!2sin"
                      title="StockTrack office location"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.openMapButton}
                    >
                      ↗ Open Map
                    </a>
                  </div>

                  <div className={styles.visitContent}>
                    <h3>Visit Our Office</h3>

                    <p>
                      We&apos;d love to meet you in person. Drop by our office
                      for a quick chat about how StockTrack can help your
                      business.
                    </p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directionsButton}
                    >
                      <span>●</span>
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              <div className={styles.faqPanel}>
                <div className={styles.faqHeading}>
                  <div>
                    <h2>Frequently Asked Questions</h2>
                    <p>Find quick answers to common questions.</p>
                  </div>

                  <span>View All →</span>
                </div>

                <div className={styles.faqList}>
                  {faqs.map((faq) => (
                    <details key={faq}>
                      <summary>
                        {faq}
                        <span>›</span>
                      </summary>

                      <p>
                        Please contact the StockTrack support team for more
                        information about this question.
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export default Contact;
