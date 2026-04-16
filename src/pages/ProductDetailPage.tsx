import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '@/lib/api';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useTranslation } from '@/hooks/useTranslation';
import ProductCard from '@/components/product/ProductCard';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { addItem, items, updateQuantity } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    fetchProduct(id)
      .then(({ product, related }) => {
        setProduct(product);
        setRelated(related);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const cartItem = items.find((i) => i.product.id === id);
  const qty = cartItem?.quantity ?? 0;

  function handleAdd() {
    if (product) addItem(product);
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.loadingWrapper}>
            <div className={styles.skeletonDetail}>
              <div className={`skeleton ${styles.skeletonImg}`} />
              <div className={styles.skeletonInfo}>
                {[80, 60, 100, 40].map((w, i) => (
                  <div key={i} className={`skeleton ${styles.skeletonLine}`} style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.errorState}>
            <span className={styles.errorEmoji}>😕</span>
            <p>{error || 'Product not found'}</p>
            <button className="btn btn-ghost" onClick={() => navigate('/')}>
              {t('backToCatalog')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Back button */}
        <button className={styles.back} onClick={() => navigate(-1)}>
          {t('backToCatalog')}
        </button>

        {/* Product detail card */}
        <div className={styles.detail}>
          {/* Image/Emoji area */}
          <div className={styles.imageSection}>
            <div className={styles.emojiWrap}>
              <span className={styles.emoji}>{product.emoji}</span>
            </div>
            {product.badge && (
              <span className={`badge badge-accent ${styles.badge}`}>{product.badge}</span>
            )}
            <div className={styles.imageGlow} />
          </div>

          {/* Info section */}
          <div className={styles.infoSection}>
            {/* Category */}
            <span className={`badge badge-accent`} style={{ textTransform: 'capitalize' }}>
              {product.category}
            </span>

            <h1 className={styles.name}>
              {language === 'hi' ? product.nameHi : product.name}
            </h1>

            <p className={styles.description}>
              {language === 'hi' ? product.descriptionHi : product.description}
            </p>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>₹{product.price}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>₹{product.originalPrice}</span>
              )}
            </div>

            {/* Stock status */}
            <div className={styles.stockRow}>
              <span className={`badge ${product.inStock ? 'badge-green' : 'badge-amber'}`}>
                {product.inStock ? `● ${t('inStock')}` : `○ ${t('outOfStock')}`}
              </span>
            </div>

            {/* Cart controls */}
            <div className={styles.cartRow}>
              {qty === 0 ? (
                <button
                  className={`btn btn-primary ${styles.addBtn}`}
                  onClick={handleAdd}
                  disabled={!product.inStock}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  {t('addToCart')}
                </button>
              ) : (
                <div className={styles.stepperRow}>
                  <div className="stepper">
                    <button onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
                  </div>
                  <span className={styles.inCartLabel}>
                    {language === 'hi' ? `कार्ट में है` : `In cart`}
                  </span>
                </div>
              )}

              <button
                className={`btn btn-ghost ${styles.checkoutShortcut}`}
                onClick={() => navigate('/checkout')}
              >
                {t('checkout')} →
              </button>
            </div>

            {/* Delivery info */}
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryItem}>
                <span>🚚</span>
                <span>₹60 delivery within 5km</span>
              </div>
              <div className={styles.deliveryItem}>
                <span>🏪</span>
                <span>Free self-pickup available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>{t('relatedProducts')}</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
