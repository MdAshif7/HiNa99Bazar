import { useCartStore } from '@/store/cartStore';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './FloatingCartButton.module.css';

export default function FloatingCartButton() {
  const { getItemCount, getSubtotal, setCartOpen, isCartOpen } = useCartStore();
  const { t } = useTranslation();
  const count = getItemCount();
  const subtotal = getSubtotal();

  if (count === 0 || isCartOpen) return null;

  return (
    <button className={styles.fab} onClick={() => setCartOpen(true)}>
      <div className={styles.left}>
        <span className={styles.badge}>{count}</span>
        <span className={styles.label}>{t('cart')}</span>
      </div>
      <span className={styles.price}>₹{subtotal}</span>
    </button>
  );
}
