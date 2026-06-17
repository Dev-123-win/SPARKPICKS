'use client';

import { useState } from 'react';
import styles from './JoinModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function JoinModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setSubmitted(false); setEmail(''); setError(''); }, 300);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {submitted ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={`headline-lg ${styles.successTitle}`}>YOU&apos;RE IN.</h2>
            <p className={styles.successMsg}>
              Welcome to the SparkPicks vanguard. Check your inbox for your first drop alert.
            </p>
            <button className="btn-primary" onClick={handleClose}>START BROWSING</button>
          </div>
        ) : (
          <>
            <div className={styles.badge}>EXCLUSIVE ACCESS</div>
            <h2 className={`display-lg ${styles.title}`}>JOIN THE<br />VANGUARD.</h2>
            <p className={styles.desc}>
              Unlock early access to new drops, curator-only bundles, and verified savings — delivered straight to your inbox.
            </p>

            <ul className={styles.perks}>
              {[
                'Early access — 24h before public',
                'Free shipping on orders over $75',
                'Curator-only exclusive bundles',
                'Cancel anytime, no strings',
              ].map(perk => (
                <li key={perk} className={styles.perk}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {perk}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                className={`${styles.emailInput} ${error ? styles.emailError : ''}`}
                placeholder="Enter your email address"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                autoFocus
              />
              {error && <p className={styles.errorMsg}>{error}</p>}
              <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                JOIN NOW — IT&apos;S FREE
              </button>
            </form>
            <p className={styles.privacy}>No spam. Unsubscribe anytime. Privacy guaranteed.</p>
          </>
        )}
      </div>
    </div>
  );
}
