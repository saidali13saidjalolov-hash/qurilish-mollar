import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { formatPrice } from './App';

const FALLBACK_PRODUCT_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%231e293b'/%3E%3Cpath d='M220 290 L300 170 L380 290 Z' fill='%23ea580c' opacity='0.85'/%3E%3Ccircle cx='355' cy='165' r='24' fill='%23f8fafc' opacity='0.3'/%3E%3Ctext x='300' y='345' font-family='sans-serif' font-size='22' font-weight='bold' fill='%23f8fafc' text-anchor='middle'%3ENSTROY QURILISH MOLLARI%3C/text%3E%3C/svg%3E";

const CATEGORY_COVERAGE_CONFIG = {
  cement: {
    enabled: true,
    inputLabel: 'Yuza maydoni (m²)',
    unitSuffix: 'm²',
    defaultMeasure: 25,
    ratePerUnit: 0.35,
    reserveFactor: 1.05,
    note: '15 mm qatlam + 5% zaxira bilan'
  },
  bricks: {
    enabled: true,
    inputLabel: 'Devor maydoni (m²)',
    unitSuffix: 'm²',
    defaultMeasure: 18,
    ratePerUnit: 8.5,
    reserveFactor: 1.04,
    note: 'Standart terish + 4% kesish zaxirasi'
  },
  paints: {
    enabled: true,
    inputLabel: 'Bo‘yaladigan yuza (m²)',
    unitSuffix: 'm²',
    defaultMeasure: 40,
    ratePerUnit: 0.022,
    reserveFactor: 1.05,
    note: '2 qatlam surtish hisobida'
  },
  drywall: {
    enabled: true,
    inputLabel: 'Shift / Devor maydoni (m²)',
    unitSuffix: 'm²',
    defaultMeasure: 24,
    ratePerUnit: 0.34,
    reserveFactor: 1.06,
    note: '3 m² list o‘lchami + 6% kesish'
  },
  tiles: {
    enabled: true,
    inputLabel: 'Pol / Devor maydoni (m²)',
    unitSuffix: 'm²',
    defaultMeasure: 20,
    ratePerUnit: 1.0,
    reserveFactor: 1.08,
    note: 'Diagonal kesish uchun +8% zaxira'
  },
  metal: {
    enabled: true,
    inputLabel: 'Konstruksiya uzunligi (m)',
    unitSuffix: 'm',
    defaultMeasure: 60,
    ratePerUnit: 1.0,
    reserveFactor: 1.03,
    note: 'Ulanish joylari uchun +3% zaxira'
  },
  plumbing: {
    enabled: true,
    inputLabel: 'Trassa uzunligi (m)',
    unitSuffix: 'm',
    defaultMeasure: 30,
    ratePerUnit: 1.0,
    reserveFactor: 1.05,
    note: 'Burilishlar uchun +5% zaxira'
  },
  tools: {
    enabled: false
  }
};

function safeFormatMoney(value) {
  if (typeof formatPrice === 'function') {
    return formatPrice(value);
  }
  return Math.round(Number(value) || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  cartItem,
  onAddToCart,
  onUpdateQuantity,
  onQuickView,
  isProMode = false,
  viewMode = 'grid',
  animationIndex = 0,
  onShowToast
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [isFavAnimating, setIsFavAnimating] = useState(false);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [isMiniCalcOpen, setIsMiniCalcOpen] = useState(false);
  const [measureInput, setMeasureInput] = useState(() => {
    const cfg = CATEGORY_COVERAGE_CONFIG[product.category];
    return cfg && cfg.enabled ? cfg.defaultMeasure : 10;
  });
  const [customQtyDraft, setCustomQtyDraft] = useState('');
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [pointerGlow, setPointerGlow] = useState({ x: 50, y: 50, active: false });

  const cardRef = useRef(null);
  const qtyInputRef = useRef(null);

  const currentCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 30;
  const isListView = viewMode === 'list';

  useEffect(() => {
    if (isEditingQty && qtyInputRef.current) {
      qtyInputRef.current.focus();
      qtyInputRef.current.select();
    }
  }, [isEditingQty]);

  const pricingAnalysis = useMemo(() => {
    const basePrice = product.price;
    const oldPrice = product.oldPrice || null;
    const retailDiscountPercent =
      oldPrice && oldPrice > basePrice
        ? Math.round(((oldPrice - basePrice) / oldPrice) * 100)
        : 0;

    const qualifiesBulkByQty = currentCartQty >= product.bulkMinQty;
    const isBulkUnlocked = isProMode || qualifiesBulkByQty;

    const effectiveUnitPrice =
      isBulkUnlocked && product.bulkDiscountPercent
        ? Math.round(basePrice * (1 - product.bulkDiscountPercent / 100))
        : basePrice;

    const wholesalePreviewPrice = product.bulkDiscountPercent
      ? Math.round(basePrice * (1 - product.bulkDiscountPercent / 100))
      : basePrice;

    const unitSavings = basePrice - effectiveUnitPrice;
    const totalLineAmount = effectiveUnitPrice * Math.max(1, currentCartQty);
    const totalCartSavings = unitSavings * currentCartQty;

    const remainingForBulk = Math.max(0, product.bulkMinQty - currentCartQty);
    const bulkProgressPercent = Math.min(
      100,
      Math.round(((isProMode ? product.bulkMinQty : currentCartQty) / product.bulkMinQty) * 100)
    );

    return {
      basePrice,
      oldPrice,
      retailDiscountPercent,
      isBulkUnlocked,
      effectiveUnitPrice,
      wholesalePreviewPrice,
      unitSavings,
      totalLineAmount,
      totalCartSavings,
      remainingForBulk,
      bulkProgressPercent
    };
  }, [product, currentCartQty, isProMode]);

  const specEntries = useMemo(() => {
    if (!product.specs || typeof product.specs !== 'object') return [];
    return Object.entries(product.specs);
  }, [product.specs]);

  const coverageConfig = useMemo(() => {
    return CATEGORY_COVERAGE_CONFIG[product.category] || { enabled: false };
  }, [product.category]);

  const estimatedNeededUnits = useMemo(() => {
    if (!coverageConfig.enabled) return 1;
    const safeMeasure = Math.max(1, Number(measureInput) || 1);
    const rawUnits = safeMeasure * coverageConfig.ratePerUnit * coverageConfig.reserveFactor;
    return Math.min(product.stock || 9999, Math.max(1, Math.ceil(rawUnits)));
  }, [coverageConfig, measureInput, product.stock]);

  const handleMouseMove = useCallback((event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPercent = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    const yPercent = Math.round(((event.clientY - rect.top) / rect.height) * 100);
    setPointerGlow({ x: xPercent, y: yPercent, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPointerGlow((prev) => ({ ...prev, active: false }));
  }, []);

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    setIsFavAnimating(true);
    setTimeout(() => setIsFavAnimating(false), 380);
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleCopySku = (event) => {
    event.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(product.sku).catch(() => {});
    }
    if (onShowToast) {
      onShowToast(`Artikul nusxalandi: ${product.sku}`, 'info');
    }
  };

  const handleAddSingle = () => {
    if (isOutOfStock) return;
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
  };

  const handleUnlockBulkTier = () => {
    if (isOutOfStock) return;
    const qtyToAdd =
      currentCartQty === 0 ? product.bulkMinQty : pricingAnalysis.remainingForBulk;
    if (qtyToAdd <= 0) return;

    if (onAddToCart) {
      onAddToCart(product, qtyToAdd);
    }
    if (onShowToast) {
      onShowToast(
        `Optom narx faollashtirildi! (-${product.bulkDiscountPercent}% chegirma)`,
        'success'
      );
    }
  };

  const handleAddCalculatedUnits = () => {
    if (isOutOfStock) return;
    if (onAddToCart) {
      onAddToCart(product, estimatedNeededUnits);
    }
    setIsMiniCalcOpen(false);
    if (onShowToast) {
      onShowToast(
        `${measureInput} ${coverageConfig.unitSuffix} uchun ${estimatedNeededUnits} ${product.unit} savatga qo‘shildi`,
        'success'
      );
    }
  };

  const commitCustomQuantity = () => {
    setIsEditingQty(false);
    const parsed = parseInt(customQtyDraft, 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(0, Math.min(product.stock, parsed));
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, clamped);
    }
  };

  const handleQtyKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitCustomQuantity();
    } else if (event.key === 'Escape') {
      setIsEditingQty(false);
    }
  };

  const staggerDelayMs = Math.min(animationIndex * 45, 450);

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`product-card ${isListView ? 'list-view' : ''}`}
      style={{
        animationDelay: `${staggerDelayMs}ms`,
        position: 'relative'
      }}
      aria-label={product.name}
    >
      {/* Subtle interactive cursor spotlight */}
      {pointerGlow.active && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            background: `radial-gradient(280px circle at ${pointerGlow.x}% ${pointerGlow.y}%, var(--accent-primary-soft), transparent 70%)`,
            opacity: 0.65,
            transition: 'opacity 180ms ease'
          }}
        />
      )}

      {/* MAHSULOT RASMI VA BADGELAR */}
      <div className="product-card-media">
        <div className="product-badges-top">
          {product.badge && <span className="product-badge">{product.badge}</span>}

          {pricingAnalysis.retailDiscountPercent > 0 && (
            <span className="product-badge badge-discount">
              -{pricingAnalysis.retailDiscountPercent}%
            </span>
          )}

          {isProMode && product.bulkDiscountPercent > 0 && (
            <span
              className="product-badge"
              style={{
                backgroundColor: 'var(--status-success)',
                color: '#ffffff'
              }}
            >
              PRO -{product.bulkDiscountPercent}%
            </span>
          )}
        </div>

        <button
          type="button"
          className={`product-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Saralanganlardan olib tashlash' : 'Saralanganlarga saqlash'}
          title={isFavorite ? 'Saralanganlarda' : 'Saralanganlarga qo‘shish'}
          style={{
            transform: isFavAnimating ? 'scale(1.26)' : undefined
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2.1"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {!imageLoaded && !imageFailed && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--bg-surface-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            Yuklanmoqda...
          </div>
        )}

        <img
          src={imageFailed ? FALLBACK_PRODUCT_SVG : product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageFailed(true);
            setImageLoaded(true);
          }}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 260ms ease, transform 550ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        <button
          type="button"
          className="product-quickview-trigger"
          onClick={() => onQuickView && onQuickView(product)}
        >
          Tezkor ko‘rish • Batafsil
        </button>
      </div>

      {/* ASOSIY MA'LUMOTLAR QISMI */}
      <div className="product-card-body" style={{ position: 'relative', zIndex: 2 }}>
        <div className="product-meta-header">
          <span className="product-brand-tag">{product.brand}</span>
          <button
            type="button"
            className="product-sku-code"
            onClick={handleCopySku}
            title="Artikulni nusxalash"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)'
            }}
          >
            <span>{product.sku}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="product-title-btn"
          onClick={() => onQuickView && onQuickView(product)}
        >
          {product.name}
        </button>

        {isListView && product.description && (
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              marginBottom: '12px',
              lineHeight: 1.5
            }}
          >
            {product.description}
          </p>
        )}

        {/* REYTING VA OMBOR HOLATI */}
        <div className="product-rating-strip">
          <span className="rating-star">★ {product.rating.toFixed(1)}</span>
          <span className="reviews-count">({product.reviewsCount} sharh)</span>

          <span
            className={`stock-pill ${
              isOutOfStock ? 'out-stock' : isLowStock ? 'low-stock' : ''
            }`}
          >
            {isOutOfStock
              ? 'Tugagan'
              : isLowStock
              ? `Kam qoldi: ${product.stock}`
              : `Omborda: ${product.stock}`}
          </span>
        </div>

        {/* QISQA TEXNIK XUSUSIYATLAR (CHIPS) */}
        <div className="product-specs-preview">
          {(isListView || isSpecsExpanded ? specEntries : specEntries.slice(0, 2)).map(
            ([key, val]) => (
              <span key={key} className="spec-chip">
                <strong style={{ fontWeight: 700 }}>{key}:</strong> {val}
              </span>
            )
          )}

          {!isListView && specEntries.length > 2 && (
            <button
              type="button"
              onClick={() => setIsSpecsExpanded((prev) => !prev)}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                backgroundColor: 'var(--accent-primary-soft)'
              }}
            >
              {isSpecsExpanded ? 'Yig‘ish ▲' : `+${specEntries.length - 2} xususiyat ▼`}
            </button>
          )}
        </div>

        {/* QURILISH MATERIALLARI UCHUN MINI SARF KALKULYATORI */}
        {coverageConfig.enabled && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsMiniCalcOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isMiniCalcOpen ? '#ffffff' : 'var(--accent-secondary)',
                  backgroundColor: isMiniCalcOpen
                    ? 'var(--accent-secondary)'
                    : 'var(--accent-secondary-soft)',
                  border: '1px solid rgba(2, 132, 199, 0.25)',
                  transition: 'all 180ms ease'
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="11" x2="10" y2="11" />
                  <line x1="14" y1="11" x2="16" y2="11" />
                  <line x1="8" y1="15" x2="16" y2="15" />
                </svg>
                <span>{isMiniCalcOpen ? 'Hisoblagichni yopish' : 'Maydon bo‘yicha hisoblash'}</span>
              </button>
            </div>

            {isMiniCalcOpen && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-strong)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <label
                    htmlFor={`mini-calc-${product.id}`}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {coverageConfig.inputLabel}:
                  </label>
                  <input
                    id={`mini-calc-${product.id}`}
                    type="number"
                    min="1"
                    max="5000"
                    value={measureInput}
                    onChange={(e) => setMeasureInput(e.target.value)}
                    style={{
                      width: '86px',
                      height: '32px',
                      padding: '0 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-strong)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textAlign: 'right'
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.76rem'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Kerakli miqdor:</span>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '0.84rem' }}>
                    {estimatedNeededUnits} {product.unit}
                  </strong>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {coverageConfig.note}
                  </span>
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddCalculatedUnits}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--accent-secondary)',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    + {estimatedNeededUnits} qo‘shish
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ULGURJI / OPTOM CHEGIRMA PROGRESS PANELI */}
        {product.bulkMinQty && product.bulkDiscountPercent > 0 && (
          <div className={`product-bulk-banner ${pricingAnalysis.isBulkUnlocked ? 'unlocked' : ''}`}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
                marginBottom: pricingAnalysis.isBulkUnlocked ? 0 : '6px'
              }}
            >
              {pricingAnalysis.isBulkUnlocked ? (
                <span>
                  ✓ Optom narx faol (-{product.bulkDiscountPercent}%):{' '}
                  <strong>{safeFormatMoney(pricingAnalysis.effectiveUnitPrice)} so‘m</strong>
                </span>
              ) : (
                <span>
                  {product.bulkMinQty}+ {product.unit} olinsa:{' '}
                  <strong>{safeFormatMoney(pricingAnalysis.wholesalePreviewPrice)} so‘m</strong> (-
                  {product.bulkDiscountPercent}%)
                </span>
              )}

              {!pricingAnalysis.isBulkUnlocked && !isOutOfStock && (
                <button
                  type="button"
                  onClick={handleUnlockBulkTier}
                  title="Optom chegirmaga yetarli miqdorni savatga qo'shish"
                  style={{
                    padding: '2px 7px',
                    borderRadius: '5px',
                    backgroundColor: 'var(--accent-primary-soft)',
                    color: 'var(--accent-primary)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap'
                  }}
                >
                  +{pricingAnalysis.remainingForBulk} optom
                </button>
              )}
            </div>

            {!pricingAnalysis.isBulkUnlocked && currentCartQty > 0 && (
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${pricingAnalysis.bulkProgressPercent}%`,
                    height: '100%',
                    backgroundColor: 'var(--accent-primary)',
                    transition: 'width 260ms ease'
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* KARTOCHKA FOOTER: NARX VA SAVAT BOSHQARUVI */}
        <div className="product-card-footer">
          <div>
            {pricingAnalysis.oldPrice && (
              <div className="product-old-price">
                {safeFormatMoney(pricingAnalysis.oldPrice)} so‘m
              </div>
            )}

            {pricingAnalysis.isBulkUnlocked && pricingAnalysis.unitSavings > 0 && (
              <div className="product-old-price">
                {safeFormatMoney(pricingAnalysis.basePrice)} so‘m
              </div>
            )}

            <div className="product-current-price">
              {safeFormatMoney(pricingAnalysis.effectiveUnitPrice)} so‘m{' '}
              <span className="product-unit-label">/ {product.unit}</span>
            </div>

            {currentCartQty > 0 && (
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--status-success)',
                  marginTop: '3px'
                }}
              >
                Savatda: {safeFormatMoney(pricingAnalysis.totalLineAmount)} so‘m
                {pricingAnalysis.totalCartSavings > 0 &&
                  ` (tejaldi: ${safeFormatMoney(pricingAnalysis.totalCartSavings)})`}
              </div>
            )}

            {product.deliveryText && (
              <span className="product-delivery-tag">🚚 {product.deliveryText}</span>
            )}
          </div>

          {currentCartQty === 0 ? (
            <button
              type="button"
              className="btn-add-to-cart"
              disabled={isOutOfStock}
              onClick={handleAddSingle}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>{isOutOfStock ? 'Mavjud emas' : 'Savatga'}</span>
            </button>
          ) : (
            <div className="card-qty-stepper" role="group" aria-label="Miqdorni o'zgartirish">
              <button
                type="button"
                className="card-qty-btn"
                onClick={() => onUpdateQuantity && onUpdateQuantity(product.id, currentCartQty - 1)}
                aria-label="Kamaytirish"
              >
                −
              </button>

              {isEditingQty ? (
                <input
                  ref={qtyInputRef}
                  type="number"
                  min="0"
                  max={product.stock}
                  value={customQtyDraft}
                  onChange={(e) => setCustomQtyDraft(e.target.value)}
                  onBlur={commitCustomQuantity}
                  onKeyDown={handleQtyKeyDown}
                  style={{
                    width: '46px',
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'var(--bg-surface)',
                    textAlign: 'center',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    outline: 'none'
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="card-qty-value"
                  onClick={() => {
                    setCustomQtyDraft(String(currentCartQty));
                    setIsEditingQty(true);
                  }}
                  title="Miqdorni qo'lda kiritish uchun bosing"
                >
                  {currentCartQty}
                </button>
              )}

              <button
                type="button"
                className="card-qty-btn"
                disabled={currentCartQty >= product.stock}
                onClick={() => onUpdateQuantity && onUpdateQuantity(product.id, currentCartQty + 1)}
                aria-label="Ko'paytirish"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}