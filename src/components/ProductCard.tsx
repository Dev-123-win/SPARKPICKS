'use client';

import Link from 'next/link';
import styles from './ProductCard.module.css';
import { Product, getDiscount } from '@/lib/products';
import { useCurrency } from '@/hooks/useCurrency';

interface Props {
  product: Product;
  size?: 'default' | 'small';
}

export default function ProductCard({ product, size = 'default' }: Props) {
  const { fmt } = useCurrency();
  const discount = getDiscount(product.originalPrice, product.price);
  const hasDiscount = discount > 0;

  return (
    <Link href={`/product/${product.slug}`} className={`${styles.card} ${size === 'small' ? styles.small : ''}`}>
      <div className={styles.imageWrap}>
        <img
          src={product.images[0]}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
        {hasDiscount && (
          <span className={`badge badge-sale ${styles.saleBadge}`}>
            {discount}% OFF
          </span>
        )}
        {product.featured && !hasDiscount && (
          <span className={`badge ${styles.featuredBadge}`}>
            PICK
          </span>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.pricing}>
          <span className={styles.price}>{fmt(product.price)}</span>
          {hasDiscount && (
            <span className={styles.original}>{fmt(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
