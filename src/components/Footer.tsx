import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.logo}>SPARKPICKS</span>
          <nav className={styles.nav}>
            {['Practitioners', 'Contact', 'Extras', 'Privacy'].map(link => (
              <Link key={link} href="/" className={styles.navLink}>{link}</Link>
            ))}
          </nav>
        </div>
        <div className={styles.divider} />
        <div className={styles.bottom}>
          <p className={styles.copy}>© 2026 SparkPicks. All rights reserved.</p>
          <p className={styles.tagline}>Handpicked Gear. Verified Savings.</p>
        </div>
      </div>
    </footer>
  );
}
