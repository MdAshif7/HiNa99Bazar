import { useCartStore } from '@/store/cartStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isCartOpen, setCartOpen, updateQuantity, removeItem, getSubtotal, language } =
    useCartStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const subtotal = getSubtotal();

  function handleCheckout() {
    setCartOpen(false);
    navigate('/checkout');
  }

  if (!isCartOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={() => setCartOpen(false)} />
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t('myCart')}
            {items.length > 0 && (
              <span className={styles.count}>{items.reduce((a, i) => a + i.quantity, 0)}</span>
            )}
          </h2>
          <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🛒</span>
            <p className={styles.emptyTitle}>{t('emptyCart')}</p>
            <p className={styles.emptySub}>{t('emptyCartSub')}</p>
            <button className={`btn btn-ghost ${styles.continueBtn}`} onClick={() => setCartOpen(false)}>
              {t('continueShopping')}
            </button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.item}>
                  <div className={styles.itemEmoji}>{item.product.emoji}</div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>
                      {language === 'hi' ? item.product.nameHi : item.product.name}
                    </p>
                    <p className={styles.itemPrice}>₹{item.product.price}</p>
                  </div>
                  <div className={styles.itemActions}>
                    <div className="stepper">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.product.id)}
                      title={t('remove')}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.subtotalRow}>
                <span className={styles.subtotalLabel}>{t('subtotal')}</span>
                <span className={styles.subtotalValue}>₹{subtotal}</span>
              </div>
              <button
                className={`btn btn-primary ${styles.checkoutBtn}`}
                onClick={handleCheckout}
              >
                {t('checkout')} →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
