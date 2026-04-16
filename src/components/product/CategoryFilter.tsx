import { Category, CategoryMeta } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './CategoryFilter.module.css';

interface Props {
  categories: CategoryMeta[];
  active: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryFilter({ categories, active, onChange }: Props) {
  const { language } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.pill} ${active === cat.id ? styles.active : ''}`}
            onClick={() => onChange(cat.id)}
          >
            <span className={styles.emoji}>{cat.emoji}</span>
            <span>{language === 'hi' ? cat.labelHi : cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
