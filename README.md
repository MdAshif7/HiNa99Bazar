# HiNa 99™ Bazar — Frontend

> **Deal Nahi, Feel Hai** — Production-ready quick-commerce React + TypeScript frontend.

## Quick Start

```bash
npm install
cp .env.example .env   # set VITE_API_URL if you have a backend
npm run dev
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/     Navbar, Footer
│   ├── cart/       CartDrawer, FloatingCartButton
│   └── product/    ProductCard, ProductGrid, CategoryFilter
├── pages/
│   ├── HomePage           – Catalog + hero + search + category pills
│   ├── ProductDetailPage  – Full info + related products
│   ├── CheckoutPage       – Order form + delivery toggle + live totals
│   ├── OTPPage            – 6-digit OTP with auto-focus/advance/paste
│   └── TrackingPage       – Visual timeline + pay CTA + shipping info
├── store/          cartStore.ts   (Zustand + localStorage)
├── hooks/          useTranslation.ts
├── lib/            api.ts, mockData.ts, confetti.ts
├── i18n/           translations.ts (EN + HI)
├── types/          index.ts
└── styles/         globals.css (CSS vars, utilities)
```

## API Endpoints

All calls go to `VITE_API_URL`. Without it, mock data is used automatically.

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/catalog | All products |
| GET | /api/catalog/:id | Product + related |
| POST | /api/order | Place order → { order_ref } |
| POST | /api/order/verify | Verify OTP |
| POST | /api/order/resend-otp | Resend OTP |
| GET | /api/track/:order_ref | Order status + tracking |

## Design Tokens

| Token | Value |
|-------|-------|
| `--bg-primary` | `#0D0B1A` |
| `--accent` | `#7C6FE9` |
| `--green` | `#34D399` |
| `--font-display` | Syne |
| `--font-body` | DM Sans |
| `--font-hindi` | Noto Sans Devanagari |

## Features

- 20 products across 6 categories with full EN/HI translations
- Zustand cart with localStorage persistence
- Lazy-loaded routes with Suspense skeleton loaders
- Mobile-first grid: 2→3→4→5 columns
- Hindi/English toggle (हि / EN button in navbar)
- 6-digit OTP with auto-focus, auto-advance, paste support, backspace navigation
- Confetti burst on successful payment verification
- Mock data fallback — runs 100% without a backend
