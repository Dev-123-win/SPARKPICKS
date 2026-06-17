'use client';
import { useState, useRef, useEffect } from 'react';
import { CURRENCIES, saveCurrency, detectCurrency } from '@/lib/currency';
import styles from './CurrencySelector.module.css';

export default function CurrencySelector() {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [current, setCurrent] = useState('USD');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrent(detectCurrency());
    const handler = (e: Event) => setCurrent((e as CustomEvent<string>).detail);
    window.addEventListener('currency-changed', handler);
    return () => window.removeEventListener('currency-changed', handler);
  }, []);

  useEffect(() => {
    if (open) { inputRef.current?.focus(); setQuery(''); }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = CURRENCIES.filter(c =>
    !query ||
    c.code.toLowerCase().includes(query.toLowerCase()) ||
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.flag.includes(query)
  );

  const currentCurrency = CURRENCIES.find(c => c.code === current);

  const handleSelect = (code: string) => {
    saveCurrency(code);
    setCurrent(code);
    setOpen(false);
  };

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-label="Select currency"
        title="Change currency"
      >
        <span className={styles.flag}>{currentCurrency?.flag}</span>
        <span className={styles.code}>{current}</span>
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.searchWrap}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search currency..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className={styles.list}>
            {filtered.length === 0 ? (
              <div className={styles.noResults}>No currencies found</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.code}
                  className={`${styles.option} ${c.code === current ? styles.optionActive : ''}`}
                  onClick={() => handleSelect(c.code)}
                >
                  <span className={styles.optFlag}>{c.flag}</span>
                  <span className={styles.optCode}>{c.code}</span>
                  <span className={styles.optName}>{c.name}</span>
                  {c.code === current && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.check}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
