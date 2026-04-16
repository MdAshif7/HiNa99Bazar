import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackOrder } from '@/lib/api';
import { TrackingStatus, OrderStatus } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './TrackingPage.module.css';
import toast from 'react-hot-toast';

const STATUS_STEPS: OrderStatus[] = ['verified', 'accepted', 'paid', 'shipped', 'delivered'];

const STATUS_ICONS: Record<OrderStatus, string> = {
  verified: '✅',
  accepted: '🏪',
  paid: '💳',
  shipped: '🚚',
  delivered: '🎉',
};

export default function TrackingPage() {
  const { order_ref: paramRef } = useParams<{ order_ref?: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const [orderRef, setOrderRef] = useState(paramRef ?? '');
  const [status, setStatus] = useState<TrackingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (paramRef) {
      handleTrack(paramRef);
    }
  }, [paramRef]);

  async function handleTrack(ref?: string) {
    const id = ref ?? orderRef.trim();
    if (!id) { toast.error('Enter your order reference'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await trackOrder(id);
      setStatus(data);
    } catch {
      setError('Order not found. Please check your reference number.');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }

  const currentStep = status ? STATUS_STEPS.indexOf(status.status) : -1;

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>{t('trackOrder')}</h1>

        {/* Search form */}
        <div className={styles.searchCard}>
          <label className={styles.searchLabel}>{t('orderRef')}</label>
          <div className={styles.searchRow}>
            <input
              className="input"
              placeholder="e.g. HN123456"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              onClick={() => handleTrack()}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : t('trackNow')}
            </button>
          </div>
          {error && <p className={styles.errorMsg}>⚠️ {error}</p>}
        </div>

        {/* Status display */}
        {status && (
          <div className={styles.statusSection}>
            {/* Header */}
            <div className={styles.statusHeader}>
              <div>
                <p className={styles.refLabel}>{t('orderRef')}</p>
                <p className={styles.refValue}>#{status.order_ref}</p>
              </div>
              <span className={`badge ${status.status === 'delivered' ? 'badge-green' : 'badge-accent'}`}>
                {STATUS_ICONS[status.status]} {t(status.status)}
              </span>
            </div>

            {/* Timeline */}
            <div className={styles.timeline}>
              {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={step} className={`${styles.step} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}>
                    {/* Connector line */}
                    {i > 0 && (
                      <div className={`${styles.connector} ${isDone ? styles.connectorDone : ''}`} />
                    )}

                    {/* Node */}
                    <div className={styles.node}>
                      <span className={styles.nodeIcon}>
                        {isDone ? STATUS_ICONS[step] : <span className={styles.nodeNum}>{i + 1}</span>}
                      </span>
                      {isActive && <div className={styles.activePing} />}
                    </div>

                    {/* Label */}
                    <div className={styles.stepLabel}>
                      <p className={styles.stepName}>{t(step)}</p>
                      <p className={styles.stepDesc}>{t(`${step}Desc` as Parameters<typeof t>[0])}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment CTA — shown when accepted */}
            {status.status === 'accepted' && status.payment_link && (
              <div className={styles.paymentCard}>
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentIcon}>💳</span>
                  <div>
                    <p className={styles.paymentTitle}>{t('payNow')}</p>
                    <p className={styles.paymentAmt}>₹{status.total}</p>
                  </div>
                </div>
                <a
                  href={status.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  {t('payNow')} →
                </a>
              </div>
            )}

            {/* Shipping info — shown when shipped */}
            {(status.status === 'shipped' || status.status === 'delivered') && status.tracking_info && (
              <div className={styles.shippingCard}>
                <h3 className={styles.shippingTitle}>{t('shippingInfo')}</h3>
                <div className={styles.shippingGrid}>
                  {status.tracking_info.carrier && (
                    <div className={styles.shippingItem}>
                      <span className={styles.shippingLabel}>{t('carrier')}</span>
                      <span className={styles.shippingValue}>{status.tracking_info.carrier}</span>
                    </div>
                  )}
                  {status.tracking_info.tracking_number && (
                    <div className={styles.shippingItem}>
                      <span className={styles.shippingLabel}>{t('trackingNumber')}</span>
                      <span className={`${styles.shippingValue} ${styles.trackingNo}`}>
                        {status.tracking_info.tracking_number}
                      </span>
                    </div>
                  )}
                  {status.tracking_info.estimated_delivery && (
                    <div className={styles.shippingItem}>
                      <span className={styles.shippingLabel}>{t('estimatedDelivery')}</span>
                      <span className={styles.shippingValue}>{status.tracking_info.estimated_delivery}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order items summary */}
            {status.items && status.items.length > 0 && (
              <div className={styles.itemsCard}>
                <h3 className={styles.shippingTitle}>
                  {language === 'hi' ? 'ऑर्डर किए गए आइटम' : 'Ordered Items'}
                </h3>
                {status.items.map((item) => (
                  <div key={item.product.id} className={styles.orderItem}>
                    <span>{item.product.emoji}</span>
                    <span className={styles.orderItemName}>
                      {language === 'hi' ? item.product.nameHi : item.product.name}
                    </span>
                    <span className={styles.orderItemQty}>×{item.quantity}</span>
                    <span className={styles.orderItemPrice}>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
                <div className={styles.orderTotal}>
                  <span>{t('total')}</span>
                  <span>₹{status.total}</span>
                </div>
              </div>
            )}

            {/* Shop again */}
            <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ alignSelf: 'flex-start' }}>
              {language === 'hi' ? '← वापस खरीदारी करें' : '← Shop Again'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
