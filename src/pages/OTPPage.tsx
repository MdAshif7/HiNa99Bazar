import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useTranslation } from '@/hooks/useTranslation';
import { fireConfetti } from '@/lib/confetti';
import toast from 'react-hot-toast';
import styles from './OTPPage.module.css';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function OTPPage() {
  const { order_ref } = useParams<{ order_ref: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clearCart } = useCartStore();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    const nextEmpty = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextEmpty]?.focus();
  }

  const handleVerify = useCallback(async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    if (!order_ref) return;
    setLoading(true);
    try {
      await verifyOtp(order_ref, code);
      clearCart();
      fireConfetti();
      toast.success(t('otpVerified'), { duration: 3000 });
      setTimeout(() => navigate(`/track/${order_ref}`), 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP';
      toast.error(msg);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [otp, order_ref, clearCart, navigate, t]);

  // Auto-submit when all digits filled
  useEffect(() => {
    if (otp.every((d) => d !== '') && !loading) {
      handleVerify();
    }
  }, [otp, loading, handleVerify]);

  async function handleResend() {
    if (cooldown > 0 || !order_ref) return;
    setResending(true);
    try {
      await resendOtp(order_ref);
      toast.success('OTP sent again!');
      setCooldown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Icon */}
        <div className={styles.iconWrap}>
          <span className={styles.icon}>📱</span>
          <div className={styles.iconGlow} />
        </div>

        {/* Title */}
        <h1 className={styles.title}>{t('otpTitle')}</h1>
        <p className={styles.subtitle}>{t('otpSubtitle')}</p>

        {/* Order ref */}
        {order_ref && (
          <div className={styles.orderRef}>
            <span className="badge badge-accent">Order #{order_ref}</span>
          </div>
        )}

        {/* OTP inputs */}
        <div className={styles.otpRow} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              className={`${styles.otpInput} ${digit ? styles.filled : ''}`}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          className={`btn btn-primary ${styles.verifyBtn}`}
          onClick={handleVerify}
          disabled={loading || otp.join('').length < OTP_LENGTH}
        >
          {loading ? (
            <>
              <div className="spinner" />
              {t('processing')}
            </>
          ) : (
            t('verifyOtp')
          )}
        </button>

        {/* Resend */}
        <div className={styles.resendRow}>
          {cooldown > 0 ? (
            <span className={styles.cooldown}>
              {t('resendIn')} {cooldown}{t('seconds')}
            </span>
          ) : (
            <button
              className={styles.resendBtn}
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? '...' : t('resendOtp')}
            </button>
          )}
        </div>

        {/* Dev hint */}
        {!import.meta.env.VITE_API_URL && (
          <p className={styles.devHint}>
            💡 Demo mode: any OTP except 000000 works
          </p>
        )}
      </div>
    </main>
  );
}
