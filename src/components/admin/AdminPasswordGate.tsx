'use client';

import { useState, useEffect } from 'react';
import styles from './AdminPasswordGate.module.css';

export default function AdminPasswordGate({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('sp_admin_auth') === 'true';
    setAuth(isAuth);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456789') {
      sessionStorage.setItem('sp_admin_auth', 'true');
      setAuth(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (auth === null) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className={styles.container}>
        <div className={styles.gridBackground} />
        <form className={styles.card} onSubmit={handleSubmit}>
          <div className={styles.logo}>SPARKPICKS</div>
          <h1 className={styles.title}>ADMIN ACCESS</h1>
          <p className={styles.subtitle}>Enter password to unlock curator controls.</p>
          <div className={styles.inputWrap}>
            <input
              type="password"
              placeholder="Enter admin password..."
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              autoFocus
            />
            {error && <span className={styles.errorText}>Invalid admin password</span>}
          </div>
          <button type="submit" className={styles.submitBtn}>
            AUTHENTICATE
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
