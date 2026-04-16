import { useTranslation } from '@/hooks/useTranslation'
import { useNavigate } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const { language } = useTranslation()
  const navigate = useNavigate()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <span>99™</span>
          </div>
          <div>
            <p className={styles.brandName}>HiNa 99™ Bazar</p>
            <p className={styles.brandTag}>
              {language === 'hi' ? 'डील नहीं, फील है' : 'Deal Nahi, Feel Hai'}
            </p>
          </div>
        </div>

        <div className={styles.links}>
          <button onClick={() => navigate('/')} className={styles.link}>
            {language === 'hi' ? 'होम' : 'Home'}
          </button>
          <button onClick={() => navigate('/checkout')} className={styles.link}>
            {language === 'hi' ? 'चेकआउट' : 'Checkout'}
          </button>
          <button onClick={() => navigate('/track')} className={styles.link}>
            {language === 'hi' ? 'ट्रैक ऑर्डर' : 'Track Order'}
          </button>
        </div>

        <div className={styles.info}>
          <p className={styles.deliveryNote}>
            🚚 {language === 'hi'
              ? '5km के अंदर ₹60 डिलीवरी | सेल्फ पिकअप मुफ़्त'
              : '₹60 delivery within 5km | Free self-pickup'}
          </p>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} HiNa 99™ Bazar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
