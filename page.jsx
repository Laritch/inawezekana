import Header from './components/Header';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles/Home.module.css';

export default function Home() {
  return (
    <main>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <p className={styles.heroDescription}>A platform connecting clients with experts in various fields</p>

          {/* Dashboard Navigation Section */}
          <div className={`${styles.card} ${styles.dashboardNav}`}>
            <h2>Dashboard Navigation</h2>
            <p className={styles.navDesc}>Use the links below to access different user interfaces.</p>
            <div className={styles.navLinks}>
              <Link href="/client-dashboard" className={styles.navLink}>
                <span>›</span> Client Dashboard Login
              </Link>
              <Link href="/expert-dashboard" className={styles.navLink}>
                <span>›</span> Expert Dashboard Login
              </Link>
              <Link href="/admin-dashboard" className={styles.navLink}>
                <span>›</span> Admin Dashboard Login
              </Link>
            </div>
          </div>

          {/* UI Clone Showcase Section */}
          <div className={`${styles.card} ${styles.dashboardNav}`}>
            <h2>UI Clone Showcase</h2>
            <p className={styles.navDesc}>Explore our collection of UI design clones:</p>
            <div className={styles.navLinks}>
              <Link href="/ui-clones" className={styles.navLink}>
                <span>›</span> View All UI Clones Gallery
              </Link>
              <Link href="/apple-clone" className={styles.navLink}>
                <span>›</span> Apple-inspired Design
              </Link>
              <Link href="/stripe-clone" className={styles.navLink}>
                <span>›</span> Stripe-inspired Interface
              </Link>
              <Link href="/tesla-clone" className={styles.navLink}>
                <span>›</span> Tesla Design System
              </Link>
            </div>
          </div>

          {/* Features Overview Section */}
          <div className={styles.featureSection}>
            <div className={styles.featureContent}>
              <h2>Feature Overview</h2>
              <p>Explore all the new features we've implemented including the enhanced Expert Dashboard, appointment scheduling, client management, and ratings analytics.</p>
            </div>
            <div className={styles.featureButtons}>
              <Link href="/features" className={styles.btn}>View All Features</Link>
              <Link href="/dashboard-preview" className={styles.btn}>Dashboard Preview</Link>
              <Link href="/specializations" className={styles.btn}>Browse Specializations</Link>
              <Link href="/documentation" className={styles.btn}>Documentation</Link>
            </div>
          </div>

          {/* Mobile App Section */}
          <div className={styles.mobileSection}>
            <div className={styles.mobileMockup}>
              <div className={styles.mockupContent}>
                <h3>ExpertChat Mobile</h3>
                {/* Mobile mockup content would go here */}
              </div>
            </div>
            <div className={styles.mobileContent}>
              <h2>ExpertChat Mobile App</h2>
              <p>Experience the power of ExpertChat on the go. Our new mobile app provides seamless access to expert consultations, appointment management, and health resources from anywhere, anytime.</p>
              <div className={styles.buttonGroup}>
                <Link href="/preview-app" className={styles.whiteBtn}>Preview App</Link>
                <Link href="/early-access" className={styles.outlineWhiteBtn}>Get Early Access</Link>
              </div>
            </div>
          </div>

          {/* Expert Articles Section */}
          <div className={styles.articlesSection}>
            <div className={styles.articlesMain}>
              <h2>Expert Articles & Resources</h2>
              <p className={styles.navDesc}>Discover evidence-based articles, expert advice, and health insights from top specialists across multiple fields.</p>

              <div className={styles.articleGrid}>
                <div className={styles.articleCard}>
                  <h3>Understanding Heart Health: Key Indicators and Prevention</h3>
                  <p>Cardiology • 5 min read</p>
                </div>
                <div className={styles.articleCard}>
                  <h3>Anxiety Management Techniques for Professionals</h3>
                  <p>Mental Health • 3 min read</p>
                </div>
              </div>

              <Link href="/articles" className={styles.browseLink}>Browse all articles →</Link>
            </div>

            <div className={styles.sidebar}>
              <div className={styles.categories}>
                <h3>Health Categories</h3>
                <ul className={styles.categoriesList}>
                  <li><Link href="/category/cardiology">Cardiology</Link></li>
                  <li><Link href="/category/mental-health">Mental Health</Link></li>
                  <li><Link href="/category/nutrition">Nutrition</Link></li>
                  <li><Link href="/category/neurology">Neurology</Link></li>
                  <li><Link href="/category/dermatology">Dermatology</Link></li>
                  <li><Link href="/category/pain-management">Pain Management</Link></li>
                  <li><Link href="/category/preventive-care">Preventive Care</Link></li>
                  <li><Link href="/category/wellness">Wellness</Link></li>
                </ul>
              </div>

              <div className={styles.newsletter}>
                <h3>Newsletter</h3>
                <p>Subscribe to receive the latest health articles and expert advice.</p>
                <form className={styles.newsletterForm}>
                  <input type="email" placeholder="Your email" />
                  <button type="submit" className={styles.btnPrimary}>Subscribe</button>
                </form>
              </div>
            </div>
          </div>

          {/* Demo Login Section */}
          <div className={`${styles.card} ${styles.demoLoginSection}`}>
            <h2>Demo Login & Dashboards</h2>
            <p>Experience the platform from different user perspectives</p>
            <div className={styles.loginButtons}>
              <Link href="/client-login" className={`${styles.btn} ${styles.btnPrimary}`}>Client Login</Link>
              <Link href="/expert-login" className={`${styles.btn} ${styles.btnSecondary}`}>Expert Login</Link>
              <Link href="/admin-login" className={`${styles.btn} ${styles.btnOutline}`}>Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
