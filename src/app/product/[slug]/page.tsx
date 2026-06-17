'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SizeGuideModal from '@/components/SizeGuideModal';
import { getProductBySlug, getRelatedProducts, getDiscount, Product } from '@/lib/products';
import { addToCart } from '@/lib/cart';
import { toggleWishlist, isWishlisted } from '@/lib/wishlist';
import { addRecentlyViewed } from '@/lib/recentlyViewed';
import { useCurrency } from '@/hooks/useCurrency';
import styles from './page.module.css';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f5a623' : 'none'}
          stroke="#f5a623" strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params  = useParams();
  const slug    = params?.slug as string;
  const { fmt } = useCurrency();

  const [product,         setProduct]         = useState<Product | null>(null);
  const [related,         setRelated]         = useState<Product[]>([]);
  const [activeImage,     setActiveImage]     = useState(0);
  const [cartToast,       setCartToast]       = useState<'idle'|'adding'|'added'>('idle');
  const [buyLoading,      setBuyLoading]      = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('highlights');
  const [loaded,          setLoaded]          = useState(false);
  const [wishlisted,      setWishlisted]      = useState(false);
  const [wishToast,       setWishToast]       = useState(false);
  const [sizeGuideOpen,   setSizeGuideOpen]   = useState(false);
  const [tab,             setTab]             = useState<'visited'|'related'>('related');

  useEffect(() => {
    const p = getProductBySlug(slug);
    if (!p) return;
    setProduct(p);
    setRelated(getRelatedProducts(p, 6));
    setWishlisted(isWishlisted(p.slug));
    addRecentlyViewed(p.slug);
    setTimeout(() => setLoaded(true), 80);
  }, [slug]);

  if (!product) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.loading}><div className={styles.spinner}/></div>
        <Footer />
      </div>
    );
  }

  const discount = getDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    setCartToast('adding');
    setTimeout(() => {
      addToCart({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        image: product.images[0],
        price: product.price,
        size: 'One Size',
        quantity: 1,
      });
      setCartToast('added');
      setTimeout(() => setCartToast('idle'), 2500);
    }, 400);
  };

  const handleBuyNow = () => {
    if (!product.externalUrl) return;
    setBuyLoading(true);
    setTimeout(() => {
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer');
      setBuyLoading(false);
    }, 300);
  };

  const handleWishlist = () => {
    const result = toggleWishlist(product.slug);
    setWishlisted(result.wishlisted);
    setWishToast(true);
    setTimeout(() => setWishToast(false), 2000);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav className={styles.breadcrumbNav}>
            <Link href="/" className={styles.breadcrumbLink}>Products</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href={`/?category=${product.category}`} className={styles.breadcrumbLink}>{product.category}</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Section */}
      <div className={`container ${styles.productSection}`}>
        <div className={`${styles.productGrid} ${loaded ? styles.loaded : ''}`}>

          {/* ── GALLERY ── */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <img src={product.images[activeImage] || product.images[0]} alt={product.title} className={styles.mainImg}/>
              {discount > 0 && <span className={`badge badge-sale ${styles.galleryBadge}`}>SAVE {discount}%</span>}
              <button
                className={`${styles.imageWishBtn} ${wishlisted ? styles.wishlisted : ''}`}
                onClick={handleWishlist}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={wishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${activeImage === i ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className={styles.info}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={`headline-xl ${styles.title}`}>{product.title}</h1>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <StarRating rating={product.rating}/>
              <span className={styles.ratingScore}>{product.rating}</span>
              <a
                href="#reviews-section"
                className={styles.ratingCount}
                onClick={e => { e.preventDefault(); setExpandedSection('reviews'); document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                ({product.reviewCount} reviews)
              </a>
            </div>

            {/* Pricing — with currency */}
            <div className={styles.pricing}>
              <span className={styles.price}>{fmt(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className={styles.originalPrice}>{fmt(product.originalPrice)}</span>
                  <span className="badge badge-sale">SAVE {discount}%</span>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              <button
                className={`btn-primary ${styles.buyBtn} ${buyLoading ? styles.buyLoading : ''}`}
                onClick={handleBuyNow}
                disabled={buyLoading}
              >
                {buyLoading ? '↗ OPENING...' : 'BUY NOW ↗'}
              </button>
              <button
                className={`btn-secondary ${styles.cartBtn} ${cartToast === 'added' ? styles.cartAdded : ''} ${cartToast === 'adding' ? styles.cartAdding : ''}`}
                onClick={handleAddToCart}
                disabled={cartToast !== 'idle'}
              >
                {cartToast === 'adding' ? '...' : cartToast === 'added' ? '✓ ADDED TO CART' : 'ADD TO CART'}
              </button>
            </div>

            {/* Wishlist */}
            <button
              className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistBtnActive : ''}`}
              onClick={handleWishlist}
            >
              <svg width="15" height="15" viewBox="0 0 24 24"
                fill={wishlisted ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlisted ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}
            </button>

            {wishToast && (
              <div className={styles.wishToast}>
                {wishlisted ? '♥ Saved to wishlist' : '♡ Removed from wishlist'}
              </div>
            )}

            {/* Short description */}
            <p className={styles.description}>{product.description}</p>

            {/* Expandable Sections */}
            <div className={styles.expandables} id="reviews-section">
              {[
                {
                  key: 'highlights',
                  label: 'PRODUCT HIGHLIGHTS',
                  content: (
                    <ul className={styles.featureList}>
                      {product.features.map((f, i) => (
                        <li key={i} className={styles.featureItem}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  key: 'shipping',
                  label: 'SHIPPING & RETURNS',
                  content: (
                    <div className={styles.shippingInfo}>
                      <p>✓ <strong>Free shipping</strong> on orders over $75 — auto-applied at checkout.</p>
                      <p>✓ Express delivery (2–3 days) available at checkout.</p>
                      <p>✓ <strong>30-day hassle-free returns.</strong> Unworn, in original packaging.</p>
                      <p>✓ Free size exchanges within 60 days of purchase.</p>
                    </div>
                  ),
                },
                {
                  key: 'reviews',
                  label: `REVIEWS (${product.reviewCount})`,
                  content: (
                    <div className={styles.reviewsInfo}>
                      <div className={styles.reviewSummary}>
                        <span className={styles.reviewScore}>{product.rating}</span>
                        <div>
                          <StarRating rating={product.rating}/>
                          <span className={styles.reviewCount}>{product.reviewCount} verified reviews</span>
                        </div>
                      </div>
                      <div className={styles.reviewBars}>
                        {[5,4,3,2,1].map(star => {
                          const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1;
                          return (
                            <div key={star} className={styles.ratingBar}>
                              <span className={styles.barStar}>{star}★</span>
                              <div className={styles.barTrack}><div className={styles.barFill} style={{ width:`${pct}%` }}/></div>
                              <span className={styles.barPct}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ),
                },
              ].map(({ key, label, content }) => (
                <div key={key} className={styles.expandable}>
                  <button
                    className={styles.expandBtn}
                    onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                    aria-expanded={expandedSection === key}
                  >
                    <span className={`label-bold ${styles.expandLabel}`}>{label}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`${styles.expandIcon} ${expandedSection === key ? styles.expandIconOpen : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {expandedSection === key && <div className={styles.expandContent}>{content}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED ── */}
      <section className={`section-gap ${styles.relatedSection}`}>
        <div className="container">
          <div className={styles.tabHeader}>
            <button className={`${styles.tabBtn} ${tab === 'related' ? styles.tabBtnActive : ''}`} onClick={() => setTab('related')}>
              YOU MIGHT ALSO LIKE
            </button>
            <button className={`${styles.tabBtn} ${tab === 'visited' ? styles.tabBtnActive : ''}`} onClick={() => setTab('visited')}>
              RECENTLY VISITED
            </button>
            <Link href={`/?category=${product.category}`} className={styles.viewAllLink}>
              VIEW ALL {product.category.toUpperCase()}
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.slice(tab === 'visited' ? 0 : 2, tab === 'visited' ? 4 : 6).map((p, i) => (
              <div key={p.id} style={{ animationDelay:`${i * 0.05}s` }} className={styles.relatedItem}>
                <ProductCard product={p}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)}/>
    </div>
  );
}
