'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/Sidebar';
import { getAllProducts, deleteProduct, getStats, formatPrice, getDiscount, Product } from '@/lib/products';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ total: 0, featured: 0, categories: 0 });
  const [visibleCount, setVisibleCount] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setProducts(getAllProducts());
    setStats(getStats());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteProduct(id);
      loadData();
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={`headline-xl ${styles.pageTitle}`}>DASHBOARD</h1>
            <p className={styles.pageSubtitle}>Overview of your curated selection.</p>
          </div>
          <Link href="/" className={styles.viewStorefront} target="_blank">
            VIEW STOREFRONT
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {[
            {
              label: 'TOTAL PRODUCTS',
              value: stats.total,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              ),
              highlight: false,
            },
            {
              label: 'FEATURED PICKS',
              value: stats.featured,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ),
              highlight: true,
            },
            {
              label: 'ACTIVE CATEGORIES',
              value: stats.categories,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
              ),
              highlight: false,
            },
          ].map(stat => (
            <div key={stat.label} className={`${styles.statCard} ${stat.highlight ? styles.statHighlight : ''}`}>
              <div className={styles.statHeader}>
                <span className={`label-bold ${styles.statLabel}`}>{stat.label}</span>
                <span className={styles.statIcon}>{stat.icon}</span>
              </div>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={`headline-md ${styles.tableTitle}`}>RECENT PRODUCTS</h2>
            <Link href="/sammyfindys/product/new" className="btn-primary">
              + ADD NEW
            </Link>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.th}>IMG</th>
                  <th className={styles.th}>PRODUCT NAME</th>
                  <th className={styles.th}>CATEGORY</th>
                  <th className={styles.th}>PRICE</th>
                  <th className={styles.th}>STATUS</th>
                  <th className={styles.th}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product) => {
                  const disc = getDiscount(product.originalPrice, product.price);
                  return (
                    <tr key={product.id} className={styles.tableRow}>
                      <td className={styles.td}>
                        <div className={styles.productThumb}>
                          <img
                            src={product.images[0]}
                            alt={product.title}
                          />
                        </div>
                      </td>
                      <td className={styles.td}>
                        <Link href={`/product/${product.slug}`} className={styles.productName}>
                          {product.title}
                        </Link>
                        {disc > 0 && (
                          <span className={styles.discountTag}>−{disc}%</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        <span className={styles.category}>{product.category}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.price}>{formatPrice(product.price)}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={`badge ${product.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                          {product.status.toUpperCase()}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actions}>
                          <Link
                            href={`/sammyfindys/product/${product.slug}/edit`}
                            className={styles.actionBtn}
                            title="Edit"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </Link>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn} ${deleteConfirm === product.id ? styles.deleteConfirm : ''}`}
                            onClick={() => handleDelete(product.id)}
                            title={deleteConfirm === product.id ? 'Click again to confirm delete' : 'Delete'}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {visibleCount < products.length && (
            <div className={styles.loadMore}>
              <button
                className="btn-secondary"
                onClick={() => setVisibleCount(v => v + 6)}
              >
                LOAD MORE
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
