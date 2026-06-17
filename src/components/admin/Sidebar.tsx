'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/sammyfindys',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      label: 'Product Management',
      href: '/sammyfindys/product/new',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandTitle}>ADMIN CONSOLE</span>
        <span className={styles.brandSub}>Manage SparkPicks Curations</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/sammyfindys' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.signOut}>
        <Link href="/" className={styles.signOutBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
