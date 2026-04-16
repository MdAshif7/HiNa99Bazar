import { useState, useEffect, useMemo } from 'react';
import { fetchCatalog } from '@/lib/api';
import { Product, Category } from '@/types';
import { CATEGORIES } from '@/lib/mockData';
import { useTranslation } from '@/hooks/useTranslation';
import ProductGrid from '@/components/product/ProductGrid';
import CategoryFilter from '@/components/product/CategoryFilter';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { t, language } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCatalog()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameHi.includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeCategory, search]);

  return (
    <main className={styles.page}>
      {/* Hero banner */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroPills}>
              <span className="badge badge-accent">🛍️ Smart Shopping</span>
              <span className="badge badge-green">₹99 – ₹999</span>
            </div>
            <h1 className={styles.heroTitle}>
              {language === 'hi' ? (
                <>
                  <span className={styles.heroAccent}>HiNa 99™</span> बाज़ार<br />
                  <span className={styles.heroSub}>डील नहीं, फील है</span>
                </>
              ) : (
                <>
                  <span className={styles.heroAccent}>HiNa 99™</span> Bazar<br />
                  <span className={styles.heroSub}>Deal Nahi, Feel Hai</span>
                </>
              )}
            </h1>
            <p className={styles.heroDesc}>
              {language === 'hi'
                ? 'हर product apni price se zyada value deta hai. Har kharidari mein double satisfaction.'
                : 'Every product delivers value beyond its price. Double satisfaction guaranteed.'}
            </p>
            {/* Stats row */}
            <div className={styles.stats}>
              {[
                { label: language === 'hi' ? 'प्रोडक्ट' : 'Products', value: '20+' },
                { label: language === 'hi' ? 'कैटेगरी' : 'Categories', value: '6' },
                { label: language === 'hi' ? 'डिलीवरी' : 'Delivery', value: '5km' },
                { label: language === 'hi' ? 'संतुष्टि' : 'Happiness', value: '100%' },
              ].map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.heroGlow} />
      </section>

      {/* Catalog section */}
      <section className={styles.catalog}>
        <div className="container">
          {/* Search bar */}
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className={`input ${styles.searchInput}`}
              placeholder={t('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Category filter */}
          <div className={styles.filterRow}>
            <CategoryFilter
              categories={CATEGORIES}
              active={activeCategory}
              onChange={(cat) => { setActiveCategory(cat); setSearch(''); }}
            />
          </div>

          {/* Result count */}
          {!loading && (
            <p className={styles.resultCount}>
              {filtered.length} {language === 'hi' ? 'प्रोडक्ट मिले' : 'products found'}
            </p>
          )}

          {/* Error state */}
          {error && (
            <div className={styles.errorBox}>
              <span>⚠️ {t('error')}</span>
              <button className="btn btn-ghost" onClick={() => window.location.reload()}>
                {t('retry')}
              </button>
            </div>
          )}

          {/* Grid */}
          <ProductGrid products={filtered} loading={loading} />
        </div>
      </section>
    </main>
  );
}
