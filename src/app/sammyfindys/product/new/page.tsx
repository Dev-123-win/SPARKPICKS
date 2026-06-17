'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/Sidebar';
import {
  getProductBySlug, saveProduct, createEmptyProduct, formatPrice, getDiscount, Product, CATEGORIES
} from '@/lib/products';
import styles from './page.module.css';
const STATUS_OPTIONS = ['none', 'published', 'draft', 'sale'];

export default function ProductEditorPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const isNew = !slug;

  const [product, setProduct] = useState<Product>(createEmptyProduct());
  const [imageUrls, setImageUrls] = useState<string[]>(['', '', '', '', '', '']);
  const [testLinkStatus, setTestLinkStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [featuresText, setFeaturesText] = useState('');

  const load = useCallback(() => {
    if (!isNew && slug) {
      const found = getProductBySlug(slug);
      if (found) {
        setProduct(found);
        setFeaturesText(found.features.join('\n'));
        const urls = [...found.images];
        while (urls.length < 6) urls.push('');
        setImageUrls(urls);
      }
    }
  }, [isNew, slug]);

  useEffect(() => { load(); }, [load]);

  const update = (field: keyof Product, value: unknown) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const calcDiscount = getDiscount(product.originalPrice, product.price);

  const handleTestLink = async () => {
    setTestLinkStatus('loading');
    await new Promise(r => setTimeout(r, 800));
    setTestLinkStatus(product.externalUrl.startsWith('http') ? 'ok' : 'error');
    setTimeout(() => setTestLinkStatus('idle'), 3000);
  };

  const handleSave = (publish: boolean) => {
    setSaving(true);
    const updatedImages = imageUrls.filter(Boolean);
    const updatedFeatures = featuresText.split('\n').map(f => f.trim()).filter(Boolean);
    const toSave: Product = {
      ...product,
      images: updatedImages,
      features: updatedFeatures,
      status: publish ? 'published' : 'draft',
    };
    saveProduct(toSave);
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push('/sammyfindys');
    }, 1200);
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/sammyfindys" className={styles.breadLink}>PRODUCTS</Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCurrent}>
            {isNew ? 'ADD NEW PICK' : `EDIT: ${product.title || slug}`}
          </span>
        </nav>

        <h1 className={`headline-xl ${styles.pageTitle}`}>
          {isNew ? 'NEW CURATED PRODUCT' : 'EDIT PRODUCT'}
        </h1>

        <div className={styles.formGrid}>
          {/* ── LEFT COLUMN ── */}
          <div className={styles.leftCol}>

            {/* Basic Info */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic Info</h2>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  PRODUCT TITLE <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Minimalist Titanium Watch"
                  value={product.title}
                  onChange={e => {
                    update('title', e.target.value);
                    if (isNew) update('slug', autoSlug(e.target.value));
                  }}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>URL SLUG</label>
                <div className={styles.slugRow}>
                  <span className={styles.slugPrefix}>sparkpicks.com/item/</span>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.slugInput}`}
                    placeholder="minimalist-titanium-watch"
                    value={product.slug}
                    onChange={e => update('slug', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>BRAND</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. ONYX"
                  value={product.brand}
                  onChange={e => update('brand', e.target.value)}
                />
              </div>
            </div>

            {/* Editorial Details */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Editorial Details</h2>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  CURATOR&apos;S NOTE (DESCRIPTION) <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>The high-end editorial text explaining why this is a &apos;Pick&apos;.</p>
                <textarea
                  className={styles.textarea}
                  placeholder="Enter compelling description..."
                  rows={5}
                  value={product.curatorNote}
                  onChange={e => update('curatorNote', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>SHORT DESCRIPTION</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Brief product description..."
                  rows={3}
                  value={product.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>
            </div>

            {/* Key Features */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Key Features</h2>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>One feature per line</label>
                <textarea
                  className={styles.textarea}
                  placeholder={"- Matte black finish\n- Swiss automatic movement\n- Water resistant to 100m"}
                  rows={6}
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                />
              </div>
            </div>

            {/* Imagery */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Imagery
                <span className={styles.imageLimit}>UP TO 6 IMAGES</span>
              </h2>
              <div className={styles.imageSlots}>
                {imageUrls.map((url, i) => (
                  <div
                    key={i}
                    className={`${styles.imageSlot} ${url ? styles.imageSlotFilled : ''}`}
                  >
                    {url ? (
                      <img src={url} alt={`Image ${i + 1}`} className={styles.slotImg} />
                    ) : (
                      <div className={styles.slotPlaceholder}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span className={styles.slotLabel}>{i === 0 ? 'COVER' : `+`}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>IMAGE URLS (MANUAL ENTRY)</label>
                {imageUrls.map((url, i) => (
                  <input
                    key={i}
                    type="url"
                    className={`${styles.input} ${styles.urlInput}`}
                    placeholder={`Image ${i + 1} URL ${i === 0 ? '(Cover)' : ''}`}
                    value={url}
                    onChange={e => {
                      const updated = [...imageUrls];
                      updated[i] = e.target.value;
                      setImageUrls(updated);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className={styles.rightCol}>

            {/* Acquisition Link */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Acquisition Link</h2>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  EXTERNAL URL <span className={styles.required}>*</span>
                </label>
                <input
                  type="url"
                  className={styles.input}
                  placeholder="https://..."
                  value={product.externalUrl}
                  onChange={e => update('externalUrl', e.target.value)}
                />
              </div>
              <button
                className={`${styles.testBtn} ${testLinkStatus !== 'idle' ? styles[`testBtn_${testLinkStatus}`] : ''}`}
                onClick={handleTestLink}
                disabled={!product.externalUrl || testLinkStatus === 'loading'}
              >
                {testLinkStatus === 'loading' && '⏳ CHECKING...'}
                {testLinkStatus === 'ok' && '✓ LINK VALID'}
                {testLinkStatus === 'error' && '✗ INVALID URL'}
                {testLinkStatus === 'idle' && '⇗ TEST LINK'}
              </button>
            </div>

            {/* Pricing */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Pricing Strategy</h2>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>ORIGINAL PRICE ($)</label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={product.originalPrice || ''}
                  onChange={e => update('originalPrice', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>SALE PRICE ($)</label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={product.price || ''}
                  onChange={e => update('price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className={styles.discountDisplay}>
                <span className={styles.discountLabel}>CALCULATED DISCOUNT</span>
                <span className={`${styles.discountValue} ${calcDiscount > 0 ? styles.discountActive : ''}`}>
                  {calcDiscount > 0 ? `−${calcDiscount}%` : '—'}
                </span>
              </div>
            </div>

            {/* Taxonomy */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Taxonomy</h2>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>PRIMARY CATEGORY</label>
                <select
                  className={styles.select}
                  value={product.category}
                  onChange={e => update('category', e.target.value)}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Badge */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Status Badge</h2>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>STATUS BADGE</label>
                <select
                  className={styles.select}
                  value={product.status}
                  onChange={e => update('status', e.target.value as 'published' | 'draft')}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visibility Toggles */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Visibility</h2>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>PUBLISHED STATUS</span>
                  <span className={styles.toggleDesc}>Make this product visible on the storefront</span>
                </div>
                <button
                  className={`${styles.toggle} ${product.status === 'published' ? styles.toggleOn : ''}`}
                  onClick={() => update('status', product.status === 'published' ? 'draft' : 'published')}
                  role="switch"
                  aria-checked={product.status === 'published'}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>HERO PLACEMENT</span>
                  <span className={styles.toggleDesc}>Feature in the homepage hero section</span>
                </div>
                <button
                  className={`${styles.toggle} ${product.heroPlacement ? styles.toggleOn : ''}`}
                  onClick={() => update('heroPlacement', !product.heroPlacement)}
                  role="switch"
                  aria-checked={product.heroPlacement}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>FEATURED PICK</span>
                  <span className={styles.toggleDesc}>Include in Featured Picks count</span>
                </div>
                <button
                  className={`${styles.toggle} ${product.featured ? styles.toggleOn : ''}`}
                  onClick={() => update('featured', !product.featured)}
                  role="switch"
                  aria-checked={product.featured}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTION BAR ── */}
        <div className={styles.actionBar}>
          <Link href="/sammyfindys" className={styles.discardBtn}>
            DISCARD CHANGES
          </Link>
          <div className={styles.saveActions}>
            <button
              className="btn-secondary"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? 'SAVING...' : 'SAVE DRAFT'}
            </button>
            <button
              className={`btn-primary ${saved ? styles.savedBtn : ''}`}
              onClick={() => handleSave(true)}
              disabled={saving || !product.title}
            >
              {saved ? '✓ PUBLISHED!' : saving ? 'SAVING...' : 'PUBLISH PICK'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
