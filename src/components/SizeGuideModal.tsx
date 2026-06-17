'use client';

import { useEffect, useState } from 'react';
import styles from './SizeGuideModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SIZES = [
  { size: 'XS', chest: '32-34"', waist: '26-28"', hip: '34-36"' },
  { size: 'S',  chest: '34-36"', waist: '28-30"', hip: '36-38"' },
  { size: 'M',  chest: '38-40"', waist: '32-34"', hip: '40-42"' },
  { size: 'L',  chest: '42-44"', waist: '36-38"', hip: '44-46"' },
  { size: 'XL', chest: '46-48"', waist: '40-42"', hip: '48-50"' },
  { size: 'XXL',chest: '50-52"', waist: '44-46"', hip: '52-54"' },
];

export default function SizeGuideModal({ open, onClose }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className="headline-md">SIZE GUIDE</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <p className={styles.note}>All measurements are in inches. For the best fit, measure your body and compare below.</p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {['SIZE', 'CHEST', 'WAIST', 'HIP'].map(h => (
                  <th key={h} className={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map(row => (
                <tr key={row.size} className={styles.tr}>
                  <td className={`${styles.td} ${styles.sizeCell}`}>{row.size}</td>
                  <td className={styles.td}>{row.chest}</td>
                  <td className={styles.td}>{row.waist}</td>
                  <td className={styles.td}>{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tips}>
          <h3 className={styles.tipsTitle}>HOW TO MEASURE</h3>
          <ul className={styles.tipsList}>
            <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, just above the belly button.</li>
            <li><strong>Hip:</strong> Measure around the fullest part of your hips, about 8" below the waistline.</li>
          </ul>
        </div>

        <p className={styles.unsure}>
          Still unsure? Our gear is designed to fit true to size. When between sizes, size up for a relaxed fit.
        </p>
      </div>
    </div>
  );
}
