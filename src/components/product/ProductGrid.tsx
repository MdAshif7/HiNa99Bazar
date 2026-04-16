import { Product } from '@/types';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface Props {
  products: Product[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={`skeleton ${styles.skeletonImg}`} />
      <div className={styles.skeletonBody}>
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '70%' }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '90%', height: 10 }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '40%', height: 22 }} />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading }: Props) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyEmoji}>🔍</span>
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((p, i) => (
        <div
          key={p.id}
          style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
        >
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
