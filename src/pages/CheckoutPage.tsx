import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useTranslation } from '@/hooks/useTranslation';
import { placeOrder } from '@/lib/api';
import { CustomerInfo } from '@/types';
import styles from './CheckoutPage.module.css';
import toast from 'react-hot-toast';

const DELIVERY_CHARGE = 60;

export default function CheckoutPage() {
  const { t, language } = useTranslation();
  const { items, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState<'delivery' | 'pickup'>('delivery');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const subtotal = getSubtotal();
  const deliveryFee = delivery === 'delivery' ? DELIVERY_CHARGE : 0;
  const total = subtotal + deliveryFee;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerInfo]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<CustomerInfo> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      newErrors.phone = 'Valid 10-digit phone required';
    if (delivery === 'delivery' && !form.address?.trim())
      newErrors.address = 'Address required for delivery';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty!'); return; }
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await placeOrder({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
        delivery,
        customer: form,
      });
      toast.success(t('orderPlaced'));
      navigate(`/verify/${res.order_ref}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>🛒</span>
            <h2>{t('emptyCart')}</h2>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>{t('checkoutTitle')}</h1>

        <form className={styles.layout} onSubmit={handleSubmit} noValidate>
          {/* Left column */}
          <div className={styles.left}>
            {/* Delivery method */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('deliveryMethod')}</h2>
              <div className={styles.deliveryOptions}>
                <label className={`${styles.deliveryOption} ${delivery === 'delivery' ? styles.selectedOption : ''}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={delivery === 'delivery'}
                    onChange={() => setDelivery('delivery')}
                    className={styles.radio}
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionEmoji}>🚚</span>
                    <div>
                      <p className={styles.optionLabel}>{t('homeDelivery')}</p>
                      <p className={styles.optionSub}>{t('deliveryCharge')}</p>
                    </div>
                  </div>
                  {delivery === 'delivery' && <span className={styles.checkMark}>✓</span>}
                </label>

                <label className={`${styles.deliveryOption} ${delivery === 'pickup' ? styles.selectedOption : ''}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={delivery === 'pickup'}
                    onChange={() => setDelivery('pickup')}
                    className={styles.radio}
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionEmoji}>🏪</span>
                    <div>
                      <p className={styles.optionLabel}>{t('selfPickup')}</p>
                      <p className={styles.optionSub} style={{ color: 'var(--green)' }}>{t('free')}</p>
                    </div>
                  </div>
                  {delivery === 'pickup' && <span className={styles.checkMark}>✓</span>}
                </label>
              </div>
            </div>

            {/* Customer details */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('customerDetails')}</h2>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>{t('name')} *</label>
                  <input
                    className={`input ${errors.name ? styles.inputError : ''}`}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                  />
                  {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>{t('email')} *</label>
                  <input
                    className={`input ${errors.email ? styles.inputError : ''}`}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="rahul@email.com"
                  />
                  {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>{t('phone')} *</label>
                  <input
                    className={`input ${errors.phone ? styles.inputError : ''}`}
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                  {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
                </div>

                {delivery === 'delivery' && (
                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{t('address')} *</label>
                    <input
                      className={`input ${errors.address ? styles.inputError : ''}`}
                      name="address"
                      value={form.address ?? ''}
                      onChange={handleChange}
                      placeholder="House no., Street, Locality, City"
                    />
                    {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
                  </div>
                )}

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label className={styles.label}>{t('notes')}</label>
                  <textarea
                    className={`input ${styles.textarea}`}
                    name="notes"
                    value={form.notes ?? ''}
                    onChange={handleChange}
                    placeholder="Any special instructions..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Order summary */}
          <div className={styles.right}>
            <div className={styles.summary}>
              <h2 className={styles.sectionTitle}>{t('orderSummary')}</h2>

              <div className={styles.summaryItems}>
                {items.map((item) => (
                  <div key={item.product.id} className={styles.summaryItem}>
                    <span className={styles.summaryEmoji}>{item.product.emoji}</span>
                    <span className={styles.summaryName}>
                      {language === 'hi' ? item.product.nameHi : item.product.name}
                    </span>
                    <span className={styles.summaryQty}>×{item.quantity}</span>
                    <span className={styles.summaryPrice}>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className={styles.divider} />

              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>{t('subtotal')}</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>{t('delivery')}</span>
                  <span style={{ color: delivery === 'pickup' ? 'var(--green)' : 'var(--text-primary)' }}>
                    {delivery === 'pickup' ? t('free') : `₹${DELIVERY_CHARGE}`}
                  </span>
                </div>
                <div className={styles.divider} />
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>{t('total')}</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    {t('processing')}
                  </>
                ) : (
                  <>{t('placeOrder')} →</>
                )}
              </button>

              <p className={styles.secureNote}>
                🔒 {language === 'hi' ? 'OTP से सत्यापन' : 'Verified via OTP'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
