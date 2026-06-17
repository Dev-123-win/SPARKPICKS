'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CartItem, getCart, removeFromCart, updateQty, clearCart, getCartTotal } from '@/lib/cart';
import { useCurrency } from '@/hooks/useCurrency';
import styles from './CartDrawer.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { fmt } = useCurrency();

  const refresh = () => setItems(getCart());

  useEffect(() => {
    refresh();
    window.addEventListener('cart-updated', refresh);
    return () => window.removeEventListener('cart-updated', refresh);
  }, []);

  const total = getCartTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>YOUR CART</h2>
          <span className={styles.count}>{items.reduce((s, i) => s + i.quantity, 0)} items</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <p>Your cart is empty.</p>
            <button className="btn-primary" onClick={onClose}>CONTINUE SHOPPING</button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className={styles.item}>
                  <Link href={`/product/${item.slug}`} onClick={onClose} className={styles.itemImg}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                  <div className={styles.itemInfo}>
                    <Link href={`/product/${item.slug}`} onClick={onClose} className={styles.itemTitle}>
                      {item.title}
                    </Link>
                    <span className={styles.itemSize}>Size: {item.size}</span>
                    <div className={styles.itemBottom}>
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => {
                            if (item.quantity <= 1) removeFromCart(item.productId, item.size);
                            else updateQty(item.productId, item.size, item.quantity - 1);
                            refresh();
                          }}
                        >−</button>
                        <span className={styles.qty}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => { updateQty(item.productId, item.size, item.quantity + 1); refresh(); }}
                        >+</button>
                      </div>
                      <span className={styles.itemPrice}>{fmt(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => { removeFromCart(item.productId, item.size); refresh(); }}
                    aria-label="Remove item"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.subtotal}>
                <span>SUBTOTAL</span>
                <span>{fmt(total)}</span>
              </div>
              <div className={styles.shipping}>
                {total >= 75
                  ? <span className={styles.freeShip}>✓ Free shipping applied</span>
                  : <span className={styles.shippingNote}>Add {fmt(75 - total)} more for free shipping</span>
                }
              </div>
              <button className={`btn-primary ${styles.checkoutBtn}`}>
                PROCEED TO CHECKOUT
              </button>
              <button
                className={styles.clearBtn}
                onClick={() => { clearCart(); refresh(); }}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
