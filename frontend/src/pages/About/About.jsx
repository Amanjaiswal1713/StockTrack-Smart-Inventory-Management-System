import PublicLayout from "../../layouts/PublicLayout";
import styles from "./About.module.css";

function About() {
  return (
    <PublicLayout>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>ABOUT US</span>

              <h1>
                Empowering Businesses
                <br />
                with <span>Smarter Inventory Solutions</span>
              </h1>

              <p className={styles.description}>
                At StockTrack, we believe inventory management should be simple,
                efficient, and intelligent. Our platform helps businesses track
                stock, manage suppliers, monitor sales and make data-driven
                decisions, all in one place.
              </p>

              <div className={styles.statistics}>
                <div className={styles.stat}>
                  <span className={styles.peopleIcon}>♣</span>

                  <div>
                    <strong>500+</strong>
                    <small>Businesses Trust Us</small>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.stat}>
                  <span className={styles.productIcon}>◆</span>

                  <div>
                    <strong>10,000+</strong>
                    <small>Products Managed</small>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.stat}>
                  <span className={styles.chartIcon}>▥</span>

                  <div>
                    <strong>99%</strong>
                    <small>Uptime Reliability</small>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.stat}>
                  <span className={styles.starIcon}>★</span>

                  <div>
                    <strong>4.8/5</strong>
                    <small>User Satisfaction</small>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.visualFrame}>
                <div className={styles.warehouse}>
                  <div className={styles.rack}>
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className={styles.personShape}>
                    <div className={styles.head} />
                    <div className={styles.body} />
                  </div>

                  <div className={styles.tablet}>
                    <div className={styles.tabletHeader}>
                      <span />
                      <span />
                    </div>

                    <div className={styles.tabletCards}>
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className={styles.tabletChart}>
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>

                <div className={styles.visualMessage}>
                  Better
                  <br />
                  Inventory
                  <br />
                  A Brighter
                  <br />
                  Tomorrow
                </div>
              </div>

              <div className={styles.growthBubble}>
                Track
                <br />
                Manage
                <br />
                Grow
              </div>

              <div className={styles.growthIcon}>▥</div>
            </div>
          </div>
        </section>

        <section className={styles.valuesSection}>
          <div className={styles.sectionHeading}>
            <h2>Our Mission, Vision & Values</h2>

            <p>
              Guided by a clear purpose, we strive to make inventory management
              smarter for everyone.
            </p>
          </div>

          <div className={styles.valueGrid}>
            <article className={`${styles.valueCard} ${styles.missionCard}`}>
              <span className={`${styles.valueIcon} ${styles.missionIcon}`}>
                ◎
              </span>

              <h3>Our Mission</h3>

              <p>
                To simplify inventory management for businesses of all sizes
                through innovative, reliable and user-friendly technology.
              </p>
            </article>

            <article className={`${styles.valueCard} ${styles.visionCard}`}>
              <span className={`${styles.valueIcon} ${styles.visionIcon}`}>
                ◉
              </span>

              <h3>Our Vision</h3>

              <p>
                To be the most trusted and intelligent inventory management
                platform, empowering businesses worldwide.
              </p>
            </article>

            <article className={`${styles.valueCard} ${styles.valuesCard}`}>
              <span className={`${styles.valueIcon} ${styles.valuesIcon}`}>
                ◆
              </span>

              <h3>Our Values</h3>

              <ul>
                <li>Customer First</li>
                <li>Innovation</li>
                <li>Integrity</li>
                <li>Simplicity</li>
                <li>Growth Together</li>
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.storySection}>
          <div className={styles.storyGrid}>
            <div className={styles.storyVisual}>
              <div className={styles.monitor}>
                <div className={styles.monitorTop}>
                  <span className={styles.monitorCircle} />

                  <div className={styles.monitorBars}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className={styles.monitorBottom}>
                  <div className={styles.donut} />

                  <div className={styles.bigBars}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>

              <div className={styles.deskPerson}>
                <span>●</span>
              </div>

              <div className={styles.storyBoxes}>
                <span />
                <span />
                <span />
              </div>

              <span className={styles.storyPlant}>♣</span>
            </div>

            <div className={styles.storyContent}>
              <span className={styles.storyEyebrow}>OUR STORY</span>

              <h2>Built for Businesses, by Problem Solvers</h2>

              <p>
                StockTrack was created with a simple idea: eliminate the chaos
                of traditional inventory tracking. What started as a focused
                project has grown into a solution designed to help businesses
                streamline their operations and drive growth.
              </p>

              <div className={styles.storyFeatures}>
                <div>
                  <span className={styles.greenStoryIcon}>●</span>

                  <section>
                    <strong>Real-World Solutions</strong>
                    <small>Built to solve actual business problems</small>
                  </section>
                </div>

                <div>
                  <span className={styles.blueStoryIcon}>♣</span>

                  <section>
                    <strong>User-Centric Design</strong>
                    <small>Simple, intuitive and efficient</small>
                  </section>
                </div>

                <div>
                  <span className={styles.purpleStoryIcon}>▥</span>

                  <section>
                    <strong>Continuous Improvement</strong>
                    <small>Always evolving with your needs</small>
                  </section>
                </div>
              </div>
            </div>

            <aside className={styles.quoteCard}>
              <span className={styles.quoteMark}>“</span>

              <blockquote>
                Inventory is not just about stock, it&apos;s about
                possibilities.
              </blockquote>

              <span className={styles.quoteLine} />

              <small>Team StockTrack</small>
            </aside>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export default About;
