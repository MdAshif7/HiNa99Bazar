import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingCartButton from '@/components/cart/FloatingCartButton';
import styles from './App.module.css';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OTPPage = lazy(() => import('@/pages/OTPPage'));
const TrackingPage = lazy(() => import('@/pages/TrackingPage'));

function PageLoader() {
  return (
    <div className={styles.pageLoader}>
      <div className={styles.loaderDot} />
      <div className={styles.loaderDot} style={{ animationDelay: '0.15s' }} />
      <div className={styles.loaderDot} style={{ animationDelay: '0.3s' }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Navbar />
        <CartDrawer />
        <FloatingCartButton />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/verify/:order_ref" element={<OTPPage />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/track/:order_ref" element={<TrackingPage />} />
          </Routes>
        </Suspense>

        <Footer />

        <Toaster
          position="top-center"
          gutter={8}
          toastOptions={{
            style: {
              background: '#1A1630',
              color: '#F0EEFF',
              border: '1px solid rgba(124,111,233,0.25)',
              borderRadius: '12px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              backdropFilter: 'blur(12px)',
            },
            success: {
              iconTheme: { primary: '#34D399', secondary: '#0D0B1A' },
              duration: 2500,
            },
            error: {
              iconTheme: { primary: '#F87171', secondary: '#0D0B1A' },
              duration: 3000,
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
