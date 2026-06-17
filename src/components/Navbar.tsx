'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CartDrawer from './CartDrawer';
import CurrencySelector from './CurrencySelector';
import { getCartCount } from '@/lib/cart';
import { getWishlistCount } from '@/lib/wishlist';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'New Arrivals', category: 'new' },
  { label: 'Electronics',  category: 'Electronics' },
  { label: 'Apparel',      category: 'Apparel' },
  { label: 'Sports',       category: 'Sports & Fitness' },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen]       = useState(false);
  const [cartCount, setCartCount]     = useState(0);
  const [wishCount, setWishCount]     = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const refreshCounts = useCallback(() => {
    setCartCount(getCartCount());
    setWishCount(getWishlistCount());
  }, []);

  useEffect(() => {
    refreshCounts();
    window.addEventListener('cart-updated', refreshCounts);
    window.addEventListener('wishlist-updated', refreshCounts);
    return () => {
      window.removeEventListener('cart-updated', refreshCounts);
      window.removeEventListener('wishlist-updated', refreshCounts);
    };
  }, [refreshCounts]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    // Dispatch event so homepage can listen and filter inline (no page reload)
    window.dispatchEvent(new CustomEvent('sp-search', { detail: q }));
    // Also update URL without navigation for shareability
    window.history.replaceState(null, '', `/?search=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
    // Scroll to catalog
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCategoryNav = (category: string) => {
    // Dispatch event for same-page filtering without navigation
    if (category === 'new') {
      window.dispatchEvent(new CustomEvent('sp-sort', { detail: 'new' }));
    } else {
      window.dispatchEvent(new CustomEvent('sp-category', { detail: category }));
    }
    window.history.replaceState(null, '', category === 'new' ? '/?sort=new' : `/?category=${encodeURIComponent(category)}`);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>SPARKPICKS</Link>

          <ul className={styles.links}>
            {NAV_LINKS.map(({ label, category }) => (
              <li key={label}>
                <button className={styles.link} onClick={() => handleCategoryNav(category)}>
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            {/* Currency Selector */}
            <CurrencySelector />

            {/* Search */}
            {searchOpen ? (
              <form className={styles.searchBox} onSubmit={handleSearch}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products, brands..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); } }}
                />
                <button type="submit" className={styles.searchSubmit} aria-label="Search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </form>
            ) : (
              <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search" title="Search products">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            )}

            {/* Wishlist */}
            <button
              className={styles.iconBtn}
              onClick={() => { window.dispatchEvent(new CustomEvent('sp-wishlist-view')); }}
              aria-label="Wishlist" title="View wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishCount > 0 && <span className={styles.badge}>{wishCount}</span>}
            </button>

            {/* Cart */}
            <button className={styles.cartBtn} onClick={() => setCartOpen(true)} aria-label="Open cart" title="View cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>

            <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span className={menuOpen ? styles.barTop : ''}/>
              <span className={menuOpen ? styles.barMid : ''}/>
              <span className={menuOpen ? styles.barBot : ''}/>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map(({ label, category }) => (
              <button key={label} className={styles.mobileLink} onClick={() => handleCategoryNav(category)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
