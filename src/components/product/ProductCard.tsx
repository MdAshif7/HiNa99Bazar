import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { t, language } = useTranslation();
  const { addItem, items, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  function handleInc(e: React.MouseEvent) {
    e.stopPropagation();
    updateQuantity(product.id, qty + 1);
  }

  function handleDec(e: React.MouseEvent) {
    e.stopPropagation();
    updateQuantity(product.id, qty - 1);
  }

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
    >
      {/* Badge */}
      {product.badge && (
        <span className={`badge badge-accent ${styles.badge}`}>{product.badge}</span>
      )}

      {/* Emoji / Image area */}
      <div className={styles.imageArea}>
        <span className={styles.emoji}>{product.emoji}</span>
        <div className={styles.glow} />
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.name}>
          {language === 'hi' ? product.nameHi : product.name}
        </p>
        <p className={styles.desc}>
          {language === 'hi' ? product.descriptionHi : product.description}
        </p>

        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.price}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>₹{product.originalPrice}</span>
            )}
          </div>

          {/* Cart control */}
          <div onClick={(e) => e.stopPropagation()}>
            {qty === 0 ? (
              <button
                className={`${styles.addBtn} ${justAdded ? styles.added : ''}`}
                onClick={handleAdd}
                disabled={!product.inStock}
              >
                {justAdded ? '✓' : '+'}
              </button>
            ) : (
              <div className={`stepper ${styles.stepper}`}>
                <button onClick={handleDec}>−</button>
                <span>{qty}</span>
                <button onClick={handleInc}>+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
