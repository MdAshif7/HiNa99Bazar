import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { t } = useTranslation();
  const { getItemCount, setCartOpen, toggleLanguage, language } = useCartStore();
  const count = getItemCount();
  const navigate = useNavigate();

  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoMark}>
            <span className={styles.logo99}>99™</span>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>{t('storeName')}</span>
            <span className={styles.logoSub}>{t('storeSubtitle')}</span>
          </div>
        </Link>

        {/* Tagline — hidden on small screens */}
        <div className={styles.tagline}>
          <span>{t('tagline')}</span>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Language toggle */}
          <button
            className={styles.langBtn}
            onClick={toggleLanguage}
            title="Toggle language"
          >
            {language === 'en' ? 'हि' : 'EN'}
          </button>

          {/* Track order */}
          <button
            className={styles.trackBtn}
            onClick={() => navigate('/track')}
            title="Track order"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </button>

          {/* Cart */}
          <button
            className={styles.cartBtn}
            onClick={() => setCartOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span className={styles.cartLabel}>{t('cart')}</span>
            {count > 0 && (
              <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
