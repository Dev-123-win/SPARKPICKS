'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import JoinModal from '@/components/JoinModal';
import { getPublishedProducts, getFeaturedProducts, getProductBySlug, getDiscount, Product, CATEGORIES as SHARED_CATEGORIES } from '@/lib/products';
import { getRecentlyViewed, clearRecentlyViewed } from '@/lib/recentlyViewed';
import { getWishlist } from '@/lib/wishlist';
import { useCurrency } from '@/hooks/useCurrency';
import styles from './page.module.css';

const CATEGORIES = ['All', ...SHARED_CATEGORIES];

export default function StorefrontPage() {
  const { fmt } = useCurrency();
  const catalogRef   = useRef<HTMLElement>(null);
  const tabsRef      = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const [allProducts,    setAllProducts]     = useState<Product[]>([]);
  const [featured,       setFeatured]        = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed]  = useState<Product[]>([]);
  const [heroProduct,    setHeroProduct]     = useState<Product | null>(null);
  const [heroLoaded,     setHeroLoaded]      = useState(false);
  const [joinOpen,       setJoinOpen]        = useState(false);
  const [searchQuery,    setSearchQuery]     = useState('');
  const [sortNew,        setSortNew]         = useState(false);
  const [showWishlist,   setShowWishlist]    = useState(false);
  const [canScrollLeft,  setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight]  = useState(true);

  // ── LOAD PRODUCTS ──
  useEffect(() => {
    const all  = getPublishedProducts();
    const feat = getFeaturedProducts();
    setAllProducts(all);
    setFeatured(feat);
    setHeroProduct(all.find(p => p.heroPlacement) || all[3] || null);

    const recentSlugs = getRecentlyViewed();
    setRecentlyViewed(
      recentSlugs.map(s => getProductBySlug(s)).filter((p): p is Product => Boolean(p)).slice(0, 6)
    );
    setTimeout(() => setHeroLoaded(true), 80);
  }, []);

  // ── LISTEN TO NAV EVENTS (search, category, sort, wishlist) ──
  useEffect(() => {
    const onSearch   = (e: Event) => { setSearchQuery((e as CustomEvent<string>).detail); setSortNew(false); setShowWishlist(false); setActiveCategory('All'); };
    const onCategory = (e: Event) => { setActiveCategory((e as CustomEvent<string>).detail); setSearchQuery(''); setSortNew(false); setShowWishlist(false); };
    const onSort     = (e: Event) => { setSortNew(true); setSearchQuery(''); setActiveCategory('All'); setShowWishlist(false); };
    const onWishlist = () => { setShowWishlist(true); setSearchQuery(''); setSortNew(false); };

    window.addEventListener('sp-search',       onSearch);
    window.addEventListener('sp-category',     onCategory);
    window.addEventListener('sp-sort',         onSort);
    window.addEventListener('sp-wishlist-view',onWishlist);
    return () => {
      window.removeEventListener('sp-search',       onSearch);
      window.removeEventListener('sp-category',     onCategory);
      window.removeEventListener('sp-sort',         onSort);
      window.removeEventListener('sp-wishlist-view',onWishlist);
    };
  }, []);

  // ── READ URL PARAMS ONCE ON MOUNT ──
  useEffect(() => {
    const params  = new URLSearchParams(window.location.search);
    const cat     = params.get('category');
    const search  = params.get('search');
    const sort    = params.get('sort');
    const view    = params.get('view');
    if (cat && CATEGORIES.includes(cat))  setActiveCategory(cat);
    if (search)                            setSearchQuery(search);
    if (sort === 'new')                    setSortNew(true);
    if (view === 'wishlist')               setShowWishlist(true);
  }, []);

  // ── SCROLL TABS INDICATOR ──
  const updateScrollIndicators = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollIndicators);
    updateScrollIndicators();
    return () => el.removeEventListener('scroll', updateScrollIndicators);
  }, [updateScrollIndicators]);

  const scrollTabs = (dir: 'left' | 'right') => {
    const el = tabsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });
  };

  // ── FILTERING ──
  const displayedProducts = (() => {
    if (showWishlist) {
      const slugs = getWishlist();
      return allProducts.filter(p => slugs.includes(p.slug));
    }
    let list = allProducts;
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory || p.tags.includes(activeCategory));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sortNew) list = [...list].reverse();
    return list;
  })();

  const handleBrowseCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSetCategory = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setSortNew(false);
    setShowWishlist(false);
    window.history.replaceState(null, '', cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`);
    // ← NO scroll here: user is already in the catalog section
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSortNew(false);
    setShowWishlist(false);
    setActiveCategory('All');
    window.history.replaceState(null, '', '/');
  };

  const trendingProducts = featured.slice(0, 4);
  const sectionTitle = showWishlist ? 'YOUR WISHLIST'
    : searchQuery   ? `RESULTS FOR "${searchQuery.toUpperCase()}"`
    : sortNew       ? 'NEW ARRIVALS'
    : activeCategory === 'All' ? 'CURATED CATALOG'
    : activeCategory.toUpperCase();

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroText} ${heroLoaded ? styles.heroTextVisible : ''}`}>
            <span className={styles.heroLabel}>SPARKPICKS VANGUARD</span>
            <h1 className={`display-lg ${styles.heroTitle}`}>
              THE DEFINITIVE<br />URBAN RUNNER
            </h1>
            <p className={styles.heroDesc}>
              Engineered for seamless impact. Curated exclusively for the SparkPicks vanguard. Limited inventory available.
            </p>
            <div className={styles.heroActions}>
              {heroProduct && (
                <Link href={`/product/${heroProduct.slug}`} className="btn-primary">
                  EXPLORE PRODUCT
                </Link>
              )}
              <button className="btn-outline-white" onClick={handleBrowseCatalog}>
                BROWSE CATALOG
              </button>
            </div>
          </div>
          {heroProduct && (
            <div className={`${styles.heroImage} ${heroLoaded ? styles.heroImageVisible : ''}`}>
              <img src={heroProduct.images[0]} alt={heroProduct.title} />
            </div>
          )}
        </div>

        {/* Trending Sidebar */}
        <div className={styles.trendingSidebar}>
          <h3 className={`label-bold ${styles.sidebarLabel}`}>TRENDING CURATION</h3>
          <ul className={styles.sidebarList}>
            {trendingProducts.map((p, i) => (
              <li key={p.id} className={styles.sidebarItem}>
                <Link href={`/product/${p.slug}`} className={styles.sidebarLink}>
                  <div className={styles.sidebarImg}>
                    <img src={p.images[0]} alt={p.title} />
                  </div>
                  <div className={styles.sidebarInfo}>
                    <span className={styles.sidebarTitle}>{p.title}</span>
                    <span className={styles.sidebarPrice}>{fmt(p.price)}</span>
                  </div>
                  <span className={styles.sidebarNum}>{String(i + 1).padStart(2, '0')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CURATED CATALOG ── */}
      <section id="catalog" ref={catalogRef} className={`section-gap ${styles.catalog}`}>
        <div className="container">

          {/* Header */}
          <div className={styles.catalogHeader}>
            <h2 className="headline-lg">{sectionTitle}</h2>
            <div className={styles.catalogActions}>
              {(searchQuery || showWishlist || sortNew) && (
                <button className={styles.clearSearch} onClick={handleClearSearch}>
                  ✕ {showWishlist ? 'EXIT WISHLIST' : 'CLEAR FILTER'}
                </button>
              )}
              {!searchQuery && !showWishlist && (
                <button
                  className={styles.viewAll}
                  onClick={() => handleSetCategory('All')}
                >
                  VIEW ALL
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs — scrollable with arrows */}
          {!searchQuery && !showWishlist && (
            <div className={styles.tabsOuter}>
              {canScrollLeft && (
                <button className={`${styles.tabArrow} ${styles.tabArrowLeft}`} onClick={() => scrollTabs('left')} aria-label="Scroll left">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}
              <div className={styles.tabsScroll} ref={tabsRef}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.tab} ${activeCategory === cat && !sortNew ? styles.tabActive : ''}`}
                    onClick={() => handleSetCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  className={`${styles.tab} ${sortNew ? styles.tabActive : ''}`}
                  onClick={() => { setSortNew(!sortNew); setActiveCategory('All'); }}
                >
                  ↑ NEWEST
                </button>
              </div>
              {canScrollRight && (
                <button className={`${styles.tabArrow} ${styles.tabArrowRight}`} onClick={() => scrollTabs('right')} aria-label="Scroll right">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )}
            </div>
          )}

          {/* Results count */}
          {displayedProducts.length > 0 && (
            <p className={styles.resultsCount}>{displayedProducts.length} product{displayedProducts.length !== 1 ? 's' : ''}</p>
          )}

          {/* Grid or Empty */}
          {displayedProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <p>{showWishlist ? "Your wishlist is empty. Browse products and save your favourites." : `No products found${searchQuery ? ` for "${searchQuery}"` : ` in "${activeCategory}"`}.`}</p>
              <button className="btn-primary" onClick={handleClearSearch}>VIEW ALL PRODUCTS</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {displayedProducts.map((p, i) => (
                <div key={p.id} className={styles.gridItem} style={{ animationDelay: `${Math.min(i, 10) * 0.04}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA DARK BANNER ── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaLeft}>
              <h2 className={`display-lg ${styles.ctaTitle}`}>
                HANDPICKED GEAR.<br />VERIFIED SAVINGS.
              </h2>
              <p className={styles.ctaDesc}>
                Join the SparkPicks vanguard. Unlock exclusive drops, priority shipping, and inventory-only pricing on our tightest curations.
              </p>
              <button
                className="btn-primary"
                style={{ background: 'white', color: 'var(--ink)', borderColor: 'white' }}
                onClick={() => setJoinOpen(true)}
              >
                JOIN NOW — IT&apos;S FREE
              </button>
            </div>
            <div className={styles.ctaRight}>
              <h3 className={`label-bold ${styles.advantageLabel}`}>THE SPARK ADVANTAGE</h3>
              <ul className={styles.advantageList}>
                {[
                  'Early access to new drops before public',
                  'Verified savings on curated selections',
                  'Free shipping on orders over $75',
                  'Curator-only exclusive bundles',
                  'Flexible guarantee & returns policy',
                ].map(item => (
                  <li key={item} className={styles.advantageItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENTLY VIEWED ── */}
      {recentlyViewed.length > 0 && (
        <section className={`section-gap ${styles.recentSection}`}>
          <div className="container">
            <div className={styles.recentHeader}>
              <h2 className="headline-lg">RECENTLY VIEWED</h2>
              <button className={styles.clearBtn} onClick={() => { clearRecentlyViewed(); setRecentlyViewed([]); }}>
                CLEAR HISTORY
              </button>
            </div>
            <div className={styles.recentGrid}>
              {recentlyViewed.map(p => {
                const disc = getDiscount(p.originalPrice, p.price);
                return (
                  <Link key={p.id} href={`/product/${p.slug}`} className={styles.recentItem}>
                    <div className={styles.recentImg}>
                      <img src={p.images[0]} alt={p.title} />
                      {disc > 0 && <span className="badge badge-sale" style={{ position:'absolute',top:8,left:8 }}>{disc}%</span>}
                    </div>
                    <span className={styles.recentTitle}>{p.title}</span>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      <span className={styles.recentPrice}>{fmt(p.price)}</span>
                      {disc > 0 && <span style={{ fontSize:11, color:'#999', textDecoration:'line-through' }}>{fmt(p.originalPrice)}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
