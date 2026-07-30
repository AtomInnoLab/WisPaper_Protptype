import React from 'react';
import { Check, HelpCircle, Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateStorageCredits, STORAGE_RMB_PER_GB } from '../utils/storagePricing';

type BillingCycle = 'monthly' | 'annual';
type PaymentMethod = 'airwallex' | 'stripe' | 'airwallex-wallets' | 'stripe-wallets';
type LocalizedText = { zh: string; en: string };
type ComparisonValue = boolean | string | LocalizedText;

const copy = (text: LocalizedText, language: 'zh' | 'en') => text[language];

const miniPack = {
  price: '$1.99',
  credits: '10.0K',
  monthly: '32,000',
  passive: '1,000',
  projectStorage: '400 GB',
};

const maxPlans = {
  x2: {
    price: '$40',
    annualPrice: '$34',
    rmb: '约 ¥300 / mo',
    annualRmb: '约 ¥255 / mo',
    monthly: '320,000',
    passive: '1,000',
    projectStorage: '400GB',
  },
  x5: {
    price: '$100',
    annualPrice: '$85',
    rmb: '约 ¥750 / mo',
    annualRmb: '约 ¥638 / mo',
    monthly: '800,000',
    passive: '2,500',
    projectStorage: '1TB',
  },
};

const comparisonRows = [
  { label: { zh: '快速搜索', en: 'Quick Search' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: '深度搜索', en: 'Deep Search' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: '问答', en: 'QA' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: '信息流', en: 'Feeds' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: { zh: '额外 XXXX 积分', en: 'Extra XXXX credits' }, standard: { zh: '额外 XXXX 积分', en: 'Extra XXXX credits' } },
  { label: { zh: '调研综述', en: 'Survey' }, free: false, plus: false, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: 'Agent', en: 'Agent' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: 'AI 索引', en: 'AI Index' }, free: '50K', plus: { zh: '全部', en: 'All' }, pro: { zh: '全部', en: 'All' }, maxX2: { zh: '全部', en: 'All' }, maxX5: { zh: '全部', en: 'All' }, miniPack: false, standard: false },
  { label: { zh: '基础高速存储', en: 'Base high-speed storage' }, free: '1GB', plus: '10GB', pro: '50GB', maxX2: '400GB', maxX5: '1TB', miniPack: false, standard: false },
  { label: { zh: '额外充值折扣', en: 'Top-up discount' }, free: false, plus: { zh: '8.8 折', en: '12% off' }, pro: { zh: '5 折', en: '50% off' }, maxX2: { zh: '5 折', en: '50% off' }, maxX5: { zh: '5 折', en: '50% off' }, miniPack: false, standard: false },
];

function InfoLabel({ label, tooltip, dark = false, language }: { label: string; tooltip: string; dark?: boolean; language: 'zh' | 'en' }) {
  return (
    <span className="uber-info-label">
      <span>{label}</span>
      <span className="uber-tooltip-wrap">
        <button type="button" className={`uber-tooltip-icon ${dark ? 'dark' : ''}`} aria-label={language === 'zh' ? `${label}说明` : `${label} details`}>
          <HelpCircle className="h-4 w-4" />
        </button>
        <span className="uber-tooltip-content" role="tooltip">
          {tooltip}
        </span>
      </span>
    </span>
  );
}

function Availability({ value, language }: { value: ComparisonValue; language: 'zh' | 'en' }) {
  if (value === true) {
    return (
      <span className="uber-check" aria-label={language === 'zh' ? '包含' : 'Included'}>
        <Check className="h-4 w-4" />
      </span>
    );
  }

  if (value === false) {
    return (
      <span className="uber-minus" aria-label={language === 'zh' ? '不包含' : 'Not included'}>
        <Minus className="h-4 w-4" />
      </span>
    );
  }

  return <span className="uber-table-value">{typeof value === 'string' ? value : copy(value, language)}</span>;
}

interface PricingPageProps {
  onOpenRecharge?: () => void;
  language?: 'zh' | 'en';
}

export function PricingPage({ onOpenRecharge, language: controlledLanguage }: PricingPageProps) {
  const { language: contextLanguage } = useLanguage();
  const language = controlledLanguage ?? contextLanguage;
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>('monthly');
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('airwallex');
  const [extraStorageGb, setExtraStorageGb] = React.useState(100);
  const isAnnual = billingCycle === 'annual';
  const extraStorageCredits = calculateStorageCredits(extraStorageGb);
  const text = (localized: LocalizedText) => copy(localized, language);

  return (
    <div className="uber-pricing-page">
      <style>{`
        .uber-pricing-page {
          --primary: #23282f;
          --on-primary: #ffffff;
          --ink: #23282f;
          --body: #636c76;
          --mute: #999999;
          --accent: #0079ff;
          --accent-hover: #1b87ff;
          --accent-soft: rgba(0, 121, 255, 0.1);
          --accent-soft-strong: rgba(0, 121, 255, 0.12);
          --accent-deep: #111fa4;
          --canvas: #ffffff;
          --canvas-soft: #f1f2f3;
          --canvas-softer: #f3f9ff;
          --line: #e5e7eb;
          --line-blue: #e6ecf4;
          --surface-pressed: #e0e0e0;
          --black-elevated: rgba(35, 40, 47, 0.9);
          min-height: 100%;
          margin: -8px auto 0;
          overflow: hidden;
          background: transparent;
          color: var(--ink);
          border-radius: 0;
          font-family: UberMoveText, system-ui, "Helvetica Neue", Arial, sans-serif;
        }

        .uber-pricing-page * { box-sizing: border-box; }

        .uber-pricing-page .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 0 96px;
        }

        .uber-pricing-page .section-head {
          position: relative;
          display: flex;
          min-height: 108px;
          align-items: flex-start;
          justify-content: center;
          margin: 0 0 40px;
        }

        .uber-pricing-page .section-head h2 {
          margin: 0;
          color: var(--ink);
          font-size: 40px;
          line-height: 56px;
          font-weight: 700;
          letter-spacing: 0;
          text-align: center;
        }

        .uber-pricing-page .section-controls {
          position: absolute;
          left: 0;
          right: 0;
          top: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .uber-pricing-page .billing-toggle {
          display: inline-flex;
          width: 228px;
          height: 36px;
          gap: 2px;
          padding: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 999px;
          pointer-events: auto;
        }

        .uber-pricing-page .billing-toggle button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-height: 32px;
          border: 0;
          border-radius: 999px;
          padding: 5px 10px;
          background: transparent;
          color: var(--ink);
          font-size: 16px;
          line-height: 22px;
          font-weight: 500;
          cursor: pointer;
        }

        .uber-pricing-page .billing-toggle button.active {
          background: var(--canvas);
          color: #1b223c;
          box-shadow: none;
        }

        .uber-pricing-page .billing-discount {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 20px;
          margin-left: 8px;
          border-radius: 999px;
          padding: 2px 6px;
          background: linear-gradient(107deg, #4da1ff 0%, #0079ff 100%);
          color: #fff;
          font-size: 14px;
          line-height: 14px;
          font-weight: 700;
        }

        .uber-pricing-page .renew-switch {
          position: absolute;
          right: 0;
          top: 8px;
          display: inline-flex;
          align-items: center;
          flex-direction: row-reverse;
          gap: 12px;
          min-height: 20px;
          border: 0;
          background: transparent;
          color: #6e7989;
          padding: 0;
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          cursor: pointer;
          pointer-events: auto;
        }

        .uber-pricing-page .renew-track {
          position: relative;
          display: inline-flex;
          width: 28px;
          height: 16px;
          border-radius: 999px;
          background: rgba(110, 121, 137, 0.35);
          transition: background 0.16s ease;
        }

        .uber-pricing-page .renew-track::after {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--canvas);
          transition: transform 0.16s ease;
        }

        .uber-pricing-page .renew-switch.active .renew-track {
          background: var(--accent);
        }

        .uber-pricing-page .renew-switch.active .renew-track::after {
          transform: translateX(12px);
        }

        .uber-pricing-page .pricing-grid {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0 0 16px;
          margin: 0;
          scroll-snap-type: x mandatory;
          scroll-padding: 0;
          -webkit-overflow-scrolling: touch;
        }

        .uber-pricing-page .pricing-grid::-webkit-scrollbar { height: 10px; }
        .uber-pricing-page .pricing-grid::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 999px;
        }
        .uber-pricing-page .pricing-grid::-webkit-scrollbar-thumb {
          background: rgba(110, 121, 137, 0.2);
          border-radius: 999px;
        }
        .uber-pricing-page .pricing-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 121, 255, 0.58);
        }

        .uber-pricing-page .plan {
          display: flex;
          flex-direction: column;
          flex: 0 0 280px;
          height: 380px;
          border-radius: 12px;
          padding: 20px;
          background: var(--canvas);
          color: var(--ink);
          scroll-snap-align: start;
          border: 1px solid var(--line);
        }

        .uber-pricing-page .plan.free {
          background: var(--canvas);
        }

        .uber-pricing-page .plan.plus {
          background: var(--canvas);
          border-color: var(--line);
        }

        .uber-pricing-page .plan.featured {
          background: var(--primary);
          color: var(--on-primary);
          border-color: var(--primary);
          box-shadow: rgba(35, 40, 47, 0.3) 0 18px 40px;
        }

        .uber-pricing-page .plan.max {
          background: var(--canvas);
          border-color: var(--line);
        }

        .uber-pricing-page .plan.max-x5 {
          background: var(--canvas);
          border-color: var(--line);
        }

        .uber-pricing-page .plan.mini-pack h3,
        .uber-pricing-page .plan.mini-pack .price strong {
          color: var(--accent);
        }

        .uber-pricing-page .plan.mini-pack .plan-cta {
          background: var(--accent);
        }

        .uber-pricing-page .plan.mini-pack .plan-cta:hover {
          background: var(--accent-hover);
        }

        .uber-pricing-page .plan.mini-pack .price span {
          padding-bottom: 16px;
          font-size: 12px;
        }

        .uber-pricing-page .plan-tag {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          justify-content: center;
          min-height: 20px;
          margin: 0;
          border-radius: 16px;
          padding: 2px 6px;
          background: #f4f7fa;
          color: var(--ink);
          font-size: 12px;
          line-height: 12px;
          font-weight: 500;
        }

        .uber-pricing-page .plan.featured .plan-tag {
          background: var(--on-primary);
          color: var(--ink);
        }

        .uber-pricing-page .plan.max .plan-tag {
          background: var(--line-blue);
        }

        .uber-pricing-page .plan.plus .plan-tag,
        .uber-pricing-page .plan.max-x5 .plan-tag {
          background: rgba(0, 121, 255, 0.1);
          color: var(--accent);
        }

        .uber-pricing-page .plan h3 {
          margin: 0;
          font-size: 20px;
          line-height: 28px;
          font-weight: 700;
        }

        .uber-pricing-page .plan-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 28px;
        }

        .uber-pricing-page .plan-subtitle {
          min-height: 20px;
          margin: 4px 0 24px;
          color: var(--body);
          font-size: 14px;
          line-height: 20px;
          white-space: nowrap;
        }

        .uber-pricing-page .plan.featured .plan-subtitle,
        .uber-pricing-page .plan.featured .muted,
        .uber-pricing-page .plan.featured .uber-info-label {
          color: rgba(255, 255, 255, 0.72);
        }

        .uber-pricing-page .info-list {
          display: grid;
          gap: 16px;
          margin: 20px 0 0;
        }

        .uber-pricing-page .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 20px;
          padding: 0;
          border-bottom: 0;
          font-size: 14px;
          line-height: 20px;
        }

        .uber-pricing-page .info-row:last-child { border-bottom: 0; }
        .uber-pricing-page .plan.featured .info-row { border-bottom-color: rgba(255, 255, 255, 0.16); }
        .uber-pricing-page .info-row strong {
          text-align: right;
          font-weight: 500;
        }

        .uber-pricing-page .uber-info-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--ink);
          font-weight: 500;
        }

        .uber-pricing-page .plan.featured .uber-info-label,
        .uber-pricing-page .plan.featured .info-row strong {
          color: #fff;
        }

        .uber-pricing-page .uber-tooltip-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .uber-pricing-page .uber-tooltip-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 12px;
          height: 12px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--body);
          cursor: help;
        }

        .uber-pricing-page .uber-tooltip-icon.dark {
          color: rgba(255, 255, 255, 0.72);
        }

        .uber-pricing-page .uber-tooltip-content {
          position: absolute;
          left: 0;
          bottom: calc(100% + 8px);
          z-index: 20;
          width: 220px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(4px);
          border-radius: 8px;
          background: var(--black-elevated);
          color: var(--on-primary);
          padding: 10px 12px;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 4px 16px 0px;
          font-size: 12px;
          line-height: 20px;
          transition: opacity 0.16s ease, transform 0.16s ease;
        }

        .uber-pricing-page .uber-tooltip-wrap:hover .uber-tooltip-content,
        .uber-pricing-page .uber-tooltip-icon:focus-visible + .uber-tooltip-content {
          opacity: 1;
          transform: translateY(0);
        }

        .uber-pricing-page .price-action {
          margin-top: 0;
          padding-top: 0;
          border-top: 0;
        }

        .uber-pricing-page .plan.featured .price-action {
          border-top-color: rgba(255, 255, 255, 0.18);
        }

        .uber-pricing-page .price {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin: 0;
        }

        .uber-pricing-page .price strong {
          font-size: 40px;
          line-height: 56px;
          font-weight: 700;
        }

        .uber-pricing-page .price span {
          padding-bottom: 13px;
          color: var(--body);
          font-size: 14px;
          line-height: 20px;
        }

        .uber-pricing-page .plan.featured .price span {
          color: rgba(255, 255, 255, 0.72);
        }

        .uber-pricing-page .muted {
          margin: 0;
          color: var(--body);
          font-size: 14px;
          line-height: 20px;
        }

        .uber-pricing-page .plan-cta,
        .uber-pricing-page .pill-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          border: 0;
          border-radius: 999px;
          padding: 10px 16px;
          background: var(--primary);
          color: var(--on-primary);
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.16s ease, transform 0.16s ease;
        }

        .uber-pricing-page .plan-cta {
          width: 100%;
          margin: 20px 0 0;
        }

        .uber-pricing-page .plan-cta:hover,
        .uber-pricing-page .pill-button:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
        }

        .uber-pricing-page .plan-cta.secondary,
        .uber-pricing-page .pill-button.secondary {
          background: var(--primary);
          color: var(--on-primary);
        }

        .uber-pricing-page .pill-button.secondary {
          background: var(--line-blue);
        }

        .uber-pricing-page .plan.plus .plan-cta.secondary {
          background: var(--primary);
          color: var(--on-primary);
        }

        .uber-pricing-page .plan.featured .plan-cta.secondary {
          background: var(--canvas);
          color: var(--ink);
        }

        .uber-pricing-page .plan-cta.secondary:hover,
        .uber-pricing-page .pill-button.secondary:hover {
          background: #343a43;
        }

        .uber-pricing-page .plan.plus .plan-cta.secondary:hover {
          background: var(--accent-hover);
        }

        .uber-pricing-page .plan.featured .plan-cta.secondary:hover {
          background: #f1f2f3;
        }

        .uber-pricing-page .storage-pricing-section {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.95fr);
          gap: 24px;
          margin-top: 56px;
        }

        .uber-pricing-page .storage-explainer,
        .uber-pricing-page .storage-calculator {
          border-radius: 16px;
          padding: 28px;
        }

        .uber-pricing-page .storage-explainer {
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.8);
        }

        .uber-pricing-page .storage-eyebrow {
          margin: 0;
          color: var(--accent);
          font-size: 11px;
          line-height: 16px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .uber-pricing-page .storage-explainer h3,
        .uber-pricing-page .storage-calculator h3 {
          margin: 8px 0 0;
          font-size: 24px;
          line-height: 30px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .uber-pricing-page .storage-intro {
          max-width: 580px;
          margin: 10px 0 0;
          color: var(--body);
          font-size: 13px;
          line-height: 20px;
        }

        .uber-pricing-page .storage-tiers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 24px;
        }

        .uber-pricing-page .storage-tier {
          border-radius: 12px;
          background: var(--canvas-soft);
          padding: 16px;
        }

        .uber-pricing-page .storage-tier strong {
          display: block;
          font-size: 14px;
          line-height: 20px;
        }

        .uber-pricing-page .storage-tier p {
          margin: 6px 0 0;
          color: var(--body);
          font-size: 12px;
          line-height: 18px;
        }

        .uber-pricing-page .storage-rule {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-top: 18px;
          border-top: 1px solid var(--line);
          padding-top: 16px;
          color: var(--body);
          font-size: 12px;
          line-height: 18px;
        }

        .uber-pricing-page .storage-rule-index {
          display: inline-flex;
          width: 22px;
          height: 22px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: var(--primary);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
        }

        .uber-pricing-page .storage-calculator {
          background: var(--primary);
          color: #fff;
          box-shadow: rgba(35, 40, 47, 0.24) 0 28px 56px -36px;
        }

        .uber-pricing-page .storage-calculator .storage-eyebrow {
          color: #8fc5ff;
        }

        .uber-pricing-page .storage-calculator-subtitle {
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.64);
          font-size: 12px;
          line-height: 18px;
        }

        .uber-pricing-page .storage-slider-values {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-top: 28px;
        }

        .uber-pricing-page .storage-slider-values strong {
          font-size: 36px;
          line-height: 40px;
          letter-spacing: -0.04em;
        }

        .uber-pricing-page .storage-slider-values span {
          padding-bottom: 4px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
        }

        .uber-pricing-page .storage-range {
          width: 100%;
          margin-top: 20px;
          accent-color: #fff;
          cursor: pointer;
        }

        .uber-pricing-page .storage-range-scale {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.46);
          font-size: 10px;
        }

        .uber-pricing-page .storage-credit-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 18px;
        }

        .uber-pricing-page .storage-credit-total span {
          color: rgba(255, 255, 255, 0.68);
          font-size: 12px;
        }

        .uber-pricing-page .storage-credit-total strong {
          font-size: 20px;
          line-height: 26px;
          font-variant-numeric: tabular-nums;
        }

        .uber-pricing-page .storage-calculator-note {
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.48);
          font-size: 10px;
          line-height: 16px;
        }

        .uber-pricing-page .storage-purchase-button {
          width: 100%;
          min-height: 42px;
          margin-top: 18px;
          border: 0;
          border-radius: 999px;
          background: #fff;
          color: var(--ink);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.16s ease, background 0.16s ease;
        }

        .uber-pricing-page .storage-purchase-button:hover {
          background: #f1f2f3;
          transform: translateY(-1px);
        }

        .uber-pricing-page .payment-methods {
          margin: 40px 0 0;
          padding: 0;
          border-top: 0;
        }

        .uber-pricing-page .payment-methods h3 {
          margin: 0 0 24px;
          text-align: center;
          color: var(--ink);
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
        }

        .uber-pricing-page .payment-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .uber-pricing-page .payment-option {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          height: 88px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.6);
          color: var(--ink);
          cursor: pointer;
          transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease, background 0.16s ease;
        }

        .uber-pricing-page .payment-option:hover {
          border-color: rgba(0, 121, 255, 0.34);
          background: var(--canvas);
          transform: translateY(-1px);
        }

        .uber-pricing-page .payment-option.active {
          border-color: var(--primary);
          box-shadow: rgba(35, 40, 47, 0.08) 0 10px 28px;
        }

        .uber-pricing-page .airwallex-brand,
        .uber-pricing-page .stripe-brand {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .uber-pricing-page .airwallex-brand {
          gap: 8px;
          font-size: 18px;
          line-height: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .uber-pricing-page .airwallex-mark {
          display: inline-flex;
          align-items: center;
          color: #f05245;
          font-size: 18px;
          font-weight: 900;
          transform: rotate(-8deg);
        }

        .uber-pricing-page .stripe-brand {
          color: #635bff;
          font-size: 22px;
          line-height: 24px;
          font-weight: 800;
          letter-spacing: -0.05em;
        }

        .uber-pricing-page .payment-plus {
          color: var(--body);
          font-size: 22px;
          line-height: 24px;
          font-weight: 500;
        }

        .uber-pricing-page .wallets {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .uber-pricing-page .wallet-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          color: #fff;
          font-size: 16px;
          line-height: 16px;
          font-weight: 800;
        }

        .uber-pricing-page .wallet-badge.wechat { background: #19a83a; }
        .uber-pricing-page .wallet-badge.alipay { background: var(--accent); }

        .uber-pricing-page .compare {
          margin-top: 120px;
        }

        .uber-pricing-page .compare > .section-head {
          min-height: auto;
          margin-bottom: 40px;
        }

        .uber-pricing-page .table-shell {
          overflow-x: auto;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid var(--line);
          border-radius: 12px;
        }

        .uber-pricing-page table {
          width: 100%;
          min-width: 1040px;
          border-collapse: collapse;
          font-size: 12px;
          line-height: 20px;
        }

        .uber-pricing-page th,
        .uber-pricing-page td {
          padding: 14px 18px;
          border-bottom: 0;
          text-align: center;
        }

        .uber-pricing-page th:first-child,
        .uber-pricing-page td:first-child {
          width: 16%;
          text-align: left;
          font-weight: 500;
        }

        .uber-pricing-page th {
          background: transparent;
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
        }

        .uber-pricing-page .table-plan-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 28px;
          margin: 8px auto 0;
          border-radius: 999px;
          padding: 6px 14px;
          background: var(--primary);
          color: #fff;
          font-size: 12px;
          line-height: 14px;
          text-decoration: none;
          white-space: nowrap;
        }

        .uber-pricing-page .uber-check,
        .uber-pricing-page .uber-minus {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 999px;
        }

        .uber-pricing-page .uber-check {
          background: transparent;
          color: var(--ink);
        }

        .uber-pricing-page .uber-minus {
          background: transparent;
          color: #cfd6df;
        }

        .uber-pricing-page .uber-table-value {
          font-weight: 500;
        }

        .uber-pricing-page .dark-band {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: center;
          margin-top: 56px;
          border-radius: 16px;
          background: var(--primary);
          color: var(--on-primary);
          padding: 32px;
        }

        .uber-pricing-page .dark-band h2 {
          margin: 0;
          font-size: 32px;
          line-height: 40px;
          font-weight: 700;
        }

        .uber-pricing-page .dark-band p {
          max-width: 620px;
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 16px;
          line-height: 24px;
        }

        .uber-pricing-page .dark-band .pill-button {
          background: var(--canvas);
          color: var(--ink);
        }

        .uber-pricing-page .dark-band .pill-button:hover {
          background: var(--line-blue);
        }

        .uber-pricing-page .recharge {
          margin-top: 112px;
        }

        .uber-pricing-page .recharge h2,
        .uber-pricing-page .redeem-section h2 {
          margin: 0 0 40px;
          color: var(--ink);
          font-size: 36px;
          line-height: 44px;
          font-weight: 700;
          text-align: center;
        }

        .uber-pricing-page .recharge-card {
          display: grid;
          grid-template-columns: 1.1fr 1fr 1fr;
          gap: 32px;
          align-items: stretch;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.78);
          padding: 20px;
        }

        .uber-pricing-page .recharge-intro h3,
        .uber-pricing-page .recharge-pack h3 {
          margin: 0;
          color: var(--ink);
          font-size: 16px;
          line-height: 22px;
          font-weight: 500;
        }

        .uber-pricing-page .recharge-intro p,
        .uber-pricing-page .recharge-pack p {
          margin: 8px 0 0;
          color: var(--body);
          font-size: 12px;
          line-height: 18px;
        }

        .uber-pricing-page .recharge-tip {
          margin-top: 32px;
          max-width: 260px;
        }

        .uber-pricing-page .recharge-pack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .uber-pricing-page .recharge-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .uber-pricing-page .recharge-price {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          color: var(--ink);
        }

        .uber-pricing-page .recharge-price strong {
          font-size: 36px;
          line-height: 44px;
          font-weight: 700;
        }

        .uber-pricing-page .recharge-price span {
          padding-bottom: 7px;
          color: var(--body);
          font-size: 14px;
          line-height: 18px;
        }

        .uber-pricing-page .quantity-stepper {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #6e7989;
          font-size: 12px;
        }

        .uber-pricing-page .quantity-stepper button {
          width: 18px;
          height: 18px;
          border: 0;
          border-radius: 4px;
          background: #edf3f8;
          color: #6e7989;
          cursor: pointer;
        }

        .uber-pricing-page .mini-payments {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          min-height: 28px;
          border-radius: 6px;
          background: #f4f7fa;
          padding: 6px 10px;
          transform: scale(0.8);
          transform-origin: left center;
        }

        .uber-pricing-page .recharge-button {
          min-height: 32px;
          border: 1px solid var(--primary);
          border-radius: 999px;
          background: #fff;
          color: var(--ink);
          font-size: 14px;
          cursor: pointer;
        }

        .uber-pricing-page .redeem-section {
          margin-top: 120px;
          text-align: center;
        }

        .uber-pricing-page .redeem-note {
          max-width: 620px;
          margin: -24px auto 32px;
          color: var(--body);
          font-size: 12px;
          line-height: 18px;
        }

        .uber-pricing-page .redeem-ticket {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          width: 500px;
          max-width: 100%;
          margin: 0 auto;
          border-radius: 16px;
          background: #fff;
          padding: 28px 32px;
          box-shadow: rgba(35, 40, 47, 0.18) 0 22px 42px -22px;
        }

        .uber-pricing-page .redeem-input {
          height: 56px;
          border: 1px solid var(--line);
          border-radius: 8px;
          color: #b7bdc6;
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0;
        }

        .uber-pricing-page .redeem-button {
          min-height: 56px;
          border: 0;
          border-radius: 8px;
          background: var(--primary);
          color: #fff;
          padding: 0 22px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .uber-pricing-page .faq {
          margin-top: 120px;
          display: block;
        }

        .uber-pricing-page .faq h2 {
          margin: 0 0 56px;
          font-size: 36px;
          line-height: 44px;
          font-weight: 700;
          text-align: center;
        }

        .uber-pricing-page .faq-list {
          border-top: 1px solid var(--line);
        }

        .uber-pricing-page .faq-row {
          padding: 16px 0;
          border-bottom: 1px solid var(--line);
        }

        .uber-pricing-page .faq-row h3 {
          margin: 0 0 8px;
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
        }

        .uber-pricing-page .faq-row p {
          margin: 0;
          color: var(--body);
          font-size: 14px;
          line-height: 20px;
        }

        @media (max-width: 1120px) {
          .uber-pricing-page .page { padding-left: 24px; padding-right: 24px; }
          .uber-pricing-page .plan { flex-basis: 280px; }
        }

        @media (max-width: 720px) {
          .uber-pricing-page .page {
            padding: 24px 16px 56px;
          }

          .uber-pricing-page .section-head {
            min-height: 156px;
          }

          .uber-pricing-page .section-head h2 {
            font-size: 32px;
            line-height: 40px;
          }

          .uber-pricing-page .section-controls {
            top: 60px;
          }

          .uber-pricing-page .billing-toggle {
            width: min(100%, 228px);
          }

          .uber-pricing-page .renew-switch {
            top: 54px;
            right: 0;
          }

          .uber-pricing-page .recharge-card,
          .uber-pricing-page .payment-grid,
          .uber-pricing-page .storage-pricing-section {
            grid-template-columns: 1fr;
          }

          .uber-pricing-page .redeem-ticket {
            grid-template-columns: 1fr;
          }

          .uber-pricing-page .plan {
            flex-basis: min(86vw, 280px);
          }
        }
      `}</style>

      <main className="page">
        <section id="plans" aria-label={text({ zh: '定价套餐', en: 'Pricing plans' })}>
          <div className="section-head">
            <h2>{text({ zh: '定价与套餐', en: 'Pricing & Plans' })}</h2>
            <div className="section-controls">
              <div className="billing-toggle" role="group" aria-label={text({ zh: '计费周期', en: 'Billing cycle' })}>
                <button
                  type="button"
                  className={billingCycle === 'monthly' ? 'active' : ''}
                  onClick={() => setBillingCycle('monthly')}
                >
                  {text({ zh: '月付', en: 'Monthly' })}
                </button>
                <button
                  type="button"
                  className={billingCycle === 'annual' ? 'active' : ''}
                  onClick={() => setBillingCycle('annual')}
                >
                  {text({ zh: '年付', en: 'Annual' })}
                  <span className="billing-discount">-15%</span>
                </button>
              </div>
              <button
                type="button"
                className={`renew-switch ${autoRenew ? 'active' : ''}`}
                role="switch"
                aria-checked={autoRenew}
                onClick={() => setAutoRenew((current) => !current)}
              >
                <span>{text({ zh: '连续订阅', en: 'Auto-renew' })}</span>
                <span className="renew-track" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="pricing-grid">
            <article className="plan free">
              <div className="plan-title-row">
                <h3>Free</h3>
                <span className="plan-tag">Free</span>
              </div>
              <p className="plan-subtitle">{text({ zh: '体验搜索、问答和基础 Agent 能力', en: 'Try search, QA, and basic Agent features' })}</p>
              <div className="price-action">
                <p className="price"><strong>$0</strong><span>{text({ zh: '/ 月', en: '/ Mo' })}</span></p>
                <p className="muted">{text({ zh: '免费使用', en: 'Free to use' })}</p>
                <a className="plan-cta secondary" href="#">{text({ zh: '开始体验', en: 'Get started' })}</a>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '可用积分', en: 'Available credits' })} tooltip={text({ zh: '注册赠送 + 新手任务奖励。', en: 'Signup bonus plus onboarding task rewards.' })} language={language} />
                  <strong>300 + 300</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每日积分', en: 'Daily credits' })} tooltip={text({ zh: '每日登录后发放，用于当天基础体验。', en: 'Issued after daily login for basic usage that day.' })} language={language} />
                  <strong>300</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '基础高速存储', en: 'Base high-speed storage' })} tooltip={text({ zh: '新上传文件默认进入高速存储，保留满 6 个月后自动转入归档存储。', en: 'New uploads enter high-speed storage and move to archive storage after six months.' })} language={language} />
                  <strong>1 GB</strong>
                </div>
              </div>
            </article>

            <article className="plan plus">
              <div className="plan-title-row">
                <h3>Plus</h3>
                <span className="plan-tag">{text({ zh: '最受欢迎', en: 'Most popular' })}</span>
              </div>
              <p className="plan-subtitle">{text({ zh: '适合每周稳定检索和轻量问答', en: 'For steady weekly search and lightweight QA' })}</p>
              <div className="price-action">
                <p className="price"><strong>{isAnnual ? '$4.25' : '$5'}</strong><span>{text({ zh: '/ 月', en: '/ Mo' })}</span></p>
                <p className="muted">{isAnnual ? text({ zh: '约 ¥30 / mo', en: 'About ¥30 / mo' }) : text({ zh: '约 ¥35 / mo', en: 'About ¥35 / mo' })}</p>
                <a className="plan-cta secondary" href="#">{text({ zh: '订阅 Plus', en: 'Subscribe to Plus' })}</a>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每月积分', en: 'Monthly credits' })} tooltip={text({ zh: '按订阅周期发放，到期后未使用余额将清零。', en: 'Issued per billing cycle. Unused balance expires when the cycle ends.' })} language={language} />
                  <strong>10,000</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每日积分', en: 'Daily credits' })} tooltip={text({ zh: '由基础每日额度和登录奖励组成。', en: 'Includes the base daily allowance and login reward.' })} language={language} />
                  <strong>200 + 200</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '基础高速存储', en: 'Base high-speed storage' })} tooltip={text({ zh: '新上传文件默认进入高速存储，保留满 6 个月后自动转入归档存储。', en: 'New uploads enter high-speed storage and move to archive storage after six months.' })} language={language} />
                  <strong>10 GB</strong>
                </div>
              </div>
            </article>

            <article className="plan featured">
              <div className="plan-title-row">
                <h3>Pro</h3>
                <span className="plan-tag">{text({ zh: '最具性价比', en: 'Best value' })}</span>
              </div>
              <p className="plan-subtitle">{text({ zh: '最适合日常深度研究和 Agent 任务', en: 'Best for daily deep research and Agent tasks' })}</p>
              <div className="price-action">
                <p className="price"><strong>{isAnnual ? '$17' : '$20'}</strong><span>{text({ zh: '/ 月', en: '/ Mo' })}</span></p>
                <p className="muted">{isAnnual ? text({ zh: '约 ¥128 / mo', en: 'About ¥128 / mo' }) : text({ zh: '约 ¥150 / mo', en: 'About ¥150 / mo' })}</p>
                <a className="plan-cta secondary" href="#">{text({ zh: '订阅 Pro', en: 'Subscribe to Pro' })}</a>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每月积分', en: 'Monthly credits' })} tooltip={text({ zh: '按订阅周期发放，到期后未使用余额将清零。', en: 'Issued per billing cycle. Unused balance expires when the cycle ends.' })} dark language={language} />
                  <strong>160,000</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每日积分', en: 'Daily credits' })} tooltip={text({ zh: 'Pro 基础每日额度更高，登录奖励另计。', en: 'Pro includes a higher base daily allowance. Login rewards are counted separately.' })} dark language={language} />
                  <strong>500 + 200</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '基础高速存储', en: 'Base high-speed storage' })} tooltip={text({ zh: '用于 Reader、QA、Survey 和 Agent 快速调用，文件保留满 6 个月后自动归档。', en: 'Used for fast access by Reader, QA, Survey, and Agent. Files archive after six months.' })} dark language={language} />
                  <strong>50 GB</strong>
                </div>
              </div>
            </article>

            <article className="plan max max-x2">
              <div className="plan-title-row">
                <h3>Max x2</h3>
                <span className="plan-tag">{text({ zh: '团队适用', en: 'For teams' })}</span>
              </div>
              <p className="plan-subtitle">{text({ zh: '高频 Agent 使用、多项目协作和高存储需求', en: 'For frequent Agent usage, multi-project collaboration, and high storage needs' })}</p>
              <div className="price-action">
                <p className="price"><strong>{isAnnual ? maxPlans.x2.annualPrice : maxPlans.x2.price}</strong><span>{text({ zh: '/ 月', en: '/ Mo' })}</span></p>
                <p className="muted">{isAnnual ? text({ zh: maxPlans.x2.annualRmb, en: 'About ¥255 / mo' }) : text({ zh: maxPlans.x2.rmb, en: 'About ¥300 / mo' })}</p>
                <a className="plan-cta" href="#">{text({ zh: '订阅 Max x2', en: 'Subscribe to Max x2' })}</a>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每月积分', en: 'Monthly credits' })} tooltip={text({ zh: '按订阅周期发放，到期后未使用余额将清零。', en: 'Issued per billing cycle. Unused balance expires when the cycle ends.' })} language={language} />
                  <strong>{maxPlans.x2.monthly}</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每日积分', en: 'Daily credits' })} tooltip={text({ zh: '基础每日额度随档位提升，登录奖励另计。', en: 'The base daily allowance increases by plan. Login rewards are counted separately.' })} language={language} />
                  <strong>{maxPlans.x2.passive} + 200</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '基础高速存储', en: 'Base high-speed storage' })} tooltip={text({ zh: 'Max x2 包含 400GB 基础高速存储，归档存储用于长期保存低频文件。', en: 'Max x2 includes 400GB of base high-speed storage. Archive storage keeps lower-frequency files long term.' })} language={language} />
                  <strong>400 GB</strong>
                </div>
              </div>
            </article>

            <article className="plan max max-x5">
              <div className="plan-title-row">
                <h3>Max x5</h3>
              </div>
              <p className="plan-subtitle">{text({ zh: '高频 Agent 使用、多项目协作和高存储需求', en: 'For frequent Agent usage, multi-project collaboration, and high storage needs' })}</p>
              <div className="price-action">
                <p className="price"><strong>{isAnnual ? maxPlans.x5.annualPrice : maxPlans.x5.price}</strong><span>{text({ zh: '/ 月', en: '/ Mo' })}</span></p>
                <p className="muted">{isAnnual ? text({ zh: maxPlans.x5.annualRmb, en: 'About ¥638 / mo' }) : text({ zh: maxPlans.x5.rmb, en: 'About ¥750 / mo' })}</p>
                <a className="plan-cta" href="#">{text({ zh: '订阅 Max x5', en: 'Subscribe to Max x5' })}</a>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每月积分', en: 'Monthly credits' })} tooltip={text({ zh: '按订阅周期发放，到期后未使用余额将清零。', en: 'Issued per billing cycle. Unused balance expires when the cycle ends.' })} language={language} />
                  <strong>{maxPlans.x5.monthly}</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每日积分', en: 'Daily credits' })} tooltip={text({ zh: '基础每日额度随档位提升，登录奖励另计。', en: 'The base daily allowance increases by plan. Login rewards are counted separately.' })} language={language} />
                  <strong>{maxPlans.x5.passive} + 200</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '基础高速存储', en: 'Base high-speed storage' })} tooltip={text({ zh: 'Max x5 包含 1TB 基础高速存储，归档存储用于长期保存低频文件。', en: 'Max x5 includes 1TB of base high-speed storage. Archive storage keeps lower-frequency files long term.' })} language={language} />
                  <strong>1 TB</strong>
                </div>
              </div>
            </article>

            <article className="plan mini-pack">
              <div className="plan-title-row">
                <h3>Mini Pack</h3>
              </div>
              <p className="plan-subtitle">{text({ zh: '按需补充积分，适合临时高峰任务', en: 'Add credits on demand for temporary workload spikes' })}</p>
              <div className="price-action">
                <p className="price"><strong>{miniPack.price}</strong><span>USD</span></p>
                <p className="muted">{miniPack.credits} Credits</p>
                <a
                  className="plan-cta"
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    onOpenRecharge?.();
                  }}
                >
                  {text({ zh: '立即充值', en: 'Recharge now' })}
                </a>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每月积分', en: 'Monthly credits' })} tooltip={text({ zh: '按订阅周期发放，到期后未使用余额将清零。', en: 'Issued per billing cycle. Unused balance expires when the cycle ends.' })} language={language} />
                  <strong>{miniPack.monthly}</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每日积分', en: 'Daily credits' })} tooltip={text({ zh: '基础每日额度随档位提升，登录奖励另计。', en: 'The base daily allowance increases by plan. Login rewards are counted separately.' })} language={language} />
                  <strong>{miniPack.passive} + 200</strong>
                </div>
                <div className="info-row">
                  <span className="uber-info-label">{text({ zh: '存储', en: 'Storage' })}</span>
                  <strong>50 + {miniPack.projectStorage}</strong>
                </div>
              </div>
            </article>
          </div>

          <section className="storage-pricing-section" aria-labelledby="storage-pricing-title">
            <div className="storage-explainer">
              <p className="storage-eyebrow">{text({ zh: '分层存储', en: 'TIERED STORAGE' })}</p>
              <h3 id="storage-pricing-title">{text({ zh: '近期文件更快，历史文件长期保存', en: 'Fast access for recent files, long-term storage for history' })}</h3>
              <p className="storage-intro">
                {text({
                  zh: '每个会员套餐均包含基础高速存储。总高速额度由基础额度与额外购买额度组成，归档存储不占用高速额度。',
                  en: 'Every plan includes base high-speed storage. Total high-speed capacity combines the base allowance and purchased add-ons. Archived files do not consume high-speed capacity.',
                })}
              </p>

              <div className="storage-tiers">
                <article className="storage-tier">
                  <strong>{text({ zh: '高速存储 · NAS', en: 'High-speed storage · NAS' })}</strong>
                  <p>{text({ zh: '新上传文件默认进入，可被 Reader、QA、Survey 和 Agent 直接快速调用。', en: 'New uploads enter by default and are immediately available to Reader, QA, Survey, and Agent.' })}</p>
                </article>
                <article className="storage-tier">
                  <strong>{text({ zh: '归档存储', en: 'Archive storage' })}</strong>
                  <p>{text({ zh: '适合长期保存低频文件；用于 Agent 等任务前，需要先恢复至高速存储。', en: 'Designed for long-term, lower-frequency files. Restore files to high-speed storage before Agent tasks.' })}</p>
                </article>
              </div>

              <div className="storage-rule">
                <span className="storage-rule-index">6M</span>
                <span>
                  {text({
                    zh: '文件在高速存储中保留满 6 个月后自动归档并释放额度；恢复后重新计算 6 个月保留期。',
                    en: 'Files automatically archive after six months in high-speed storage, releasing capacity. Restoring a file restarts the six-month period.',
                  })}
                </span>
              </div>
            </div>

            <div className="storage-calculator">
              <p className="storage-eyebrow">{text({ zh: '额外空间估算', en: 'ADD-ON ESTIMATOR' })}</p>
              <h3>{text({ zh: '按月加购高速存储', en: 'Add high-speed storage monthly' })}</h3>
              <p className="storage-calculator-subtitle">
                {text({ zh: '首月立即扣除 Credits，后续每月自动续费，可随时取消。', en: 'The first month is charged immediately in Credits, then renews monthly until canceled.' })}
              </p>

              <div className="storage-slider-values">
                <strong>{extraStorageGb} GB</strong>
                <span>¥{STORAGE_RMB_PER_GB} / GB · {text({ zh: '月', en: 'month' })}</span>
              </div>
              <input
                className="storage-range"
                type="range"
                min="0"
                max="500"
                step="10"
                value={extraStorageGb}
                onChange={(event) => setExtraStorageGb(Number(event.target.value))}
                aria-label={text({ zh: '额外高速存储容量', en: 'Extra high-speed storage capacity' })}
              />
              <div className="storage-range-scale"><span>0 GB</span><span>500 GB</span></div>

              <div className="storage-credit-total">
                <span>{text({ zh: '预计每月扣除', en: 'Estimated monthly charge' })}</span>
                <strong>{extraStorageCredits.toLocaleString()} Credits</strong>
              </div>
              <p className="storage-calculator-note">
                {text({
                  zh: '按 ¥7 = $1、$1 = 10,000 Credits 换算；最终额度、宽限期及汇率以后台配置为准。',
                  en: 'Converted at ¥7 = $1 and $1 = 10,000 Credits. Final capacity, grace period, and rates are backend-configured.',
                })}
              </p>
              <button type="button" className="storage-purchase-button">
                {extraStorageGb > 0
                  ? text({ zh: `加购 ${extraStorageGb} GB`, en: `Add ${extraStorageGb} GB` })
                  : text({ zh: '请选择容量', en: 'Select capacity' })}
              </button>
            </div>
          </section>

          <div className="payment-methods" aria-label={text({ zh: '选择支付方式', en: 'Choose payment method' })}>
            <h3>{text({ zh: '选择支付方式', en: 'Choose payment method' })}</h3>
            <div className="payment-grid" role="radiogroup" aria-label={text({ zh: '支付方式', en: 'Payment method' })}>
              <button type="button" className={`payment-option ${paymentMethod === 'airwallex' ? 'active' : ''}`} role="radio" aria-checked={paymentMethod === 'airwallex'} onClick={() => setPaymentMethod('airwallex')}>
                <span className="airwallex-brand" aria-label="Airwallex">
                  <span className="airwallex-mark">A</span>
                  <span>Airwallex</span>
                </span>
              </button>
              <button type="button" className={`payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`} role="radio" aria-checked={paymentMethod === 'stripe'} onClick={() => setPaymentMethod('stripe')}>
                <span className="stripe-brand">stripe</span>
              </button>
              <button type="button" className={`payment-option ${paymentMethod === 'airwallex-wallets' ? 'active' : ''}`} role="radio" aria-checked={paymentMethod === 'airwallex-wallets'} onClick={() => setPaymentMethod('airwallex-wallets')}>
                <span className="airwallex-brand" aria-label="Airwallex">
                  <span className="airwallex-mark">A</span>
                  <span>Airwallex</span>
                </span>
                <span className="payment-plus">+</span>
                <span className="wallets" aria-label={text({ zh: '微信支付和支付宝', en: 'WeChat Pay and Alipay' })}>
                  <span className="wallet-badge wechat">微</span>
                  <span className="wallet-badge alipay">支</span>
                </span>
              </button>
              <button type="button" className={`payment-option ${paymentMethod === 'stripe-wallets' ? 'active' : ''}`} role="radio" aria-checked={paymentMethod === 'stripe-wallets'} onClick={() => setPaymentMethod('stripe-wallets')}>
                <span className="stripe-brand">stripe</span>
                <span className="payment-plus">+</span>
                <span className="wallets" aria-label={text({ zh: '微信支付和支付宝', en: 'WeChat Pay and Alipay' })}>
                  <span className="wallet-badge wechat">微</span>
                  <span className="wallet-badge alipay">支</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="redeem-section" aria-label={text({ zh: '兑换会员码', en: 'Redeem membership code' })}>
          <h2>{text({ zh: '兑换会员码', en: 'Redeem membership code' })}</h2>
          <p className="redeem-note">
            {text({ zh: '不限量功能仅供个人正常使用。自动脚本或异常高频调用可能触发临时限制。', en: 'Unmetered features are designed for individual human use. Automated scripts or excessive volume may trigger temporary limits.' })}
          </p>
          <div className="redeem-ticket">
            <input className="redeem-input" value="WISP2025" readOnly aria-label={text({ zh: '会员码', en: 'Membership code' })} />
            <button type="button" className="redeem-button">{text({ zh: '立即兑换', en: 'Redeem Now' })}</button>
          </div>
        </section>

        <section className="compare" aria-labelledby="compare-title">
          <div className="section-head">
            <h2 id="compare-title">{text({ zh: '套餐对比', en: 'Compare plans' })}</h2>
          </div>
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>{text({ zh: '订阅计划', en: 'Subscription plan' })}</th>
                  <th>Free</th>
                  <th>Plus<a className="table-plan-action" href="#">{text({ zh: '升级 ↗', en: 'Upgrade ↗' })}</a></th>
                  <th>Pro<a className="table-plan-action" href="#">{text({ zh: '升级 ↗', en: 'Upgrade ↗' })}</a></th>
                  <th>Max x2<a className="table-plan-action" href="#">{text({ zh: '升级 ↗', en: 'Upgrade ↗' })}</a></th>
                  <th>Max x5<a className="table-plan-action" href="#">{text({ zh: '升级 ↗', en: 'Upgrade ↗' })}</a></th>
                  <th>Mini Pack<a className="table-plan-action" href="#">{text({ zh: '充值 ↗', en: 'Recharge ↗' })}</a></th>
                  <th>Standard<a className="table-plan-action" href="#">{text({ zh: '充值 ↗', en: 'Recharge ↗' })}</a></th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label.en}>
                    <td>{text(row.label)}</td>
                    <td><Availability value={row.free} language={language} /></td>
                    <td><Availability value={row.plus} language={language} /></td>
                    <td><Availability value={row.pro} language={language} /></td>
                    <td><Availability value={row.maxX2} language={language} /></td>
                    <td><Availability value={row.maxX5} language={language} /></td>
                    <td><Availability value={row.miniPack} language={language} /></td>
                    <td><Availability value={row.standard} language={language} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">{text({ zh: '定价常见问题', en: 'Pricing FAQ' })}</h2>
          <div className="faq-list">
            <div className="faq-row">
              <h3>{text({ zh: '积分如何消耗？', en: 'How are credits consumed?' })}</h3>
              <p>{text({ zh: '积分用于 Search、Survey、QA、Feeds 和 Agent 等任务，不同任务会根据复杂度消耗不同积分。', en: 'Credits are used for Search, Survey, QA, Feeds, Agent, and related tasks. Each task consumes credits based on complexity.' })}</p>
            </div>
            <div className="faq-row">
              <h3>{text({ zh: '高速存储和归档存储有什么区别？', en: 'What is the difference between high-speed and archive storage?' })}</h3>
              <p>{text({ zh: '高速存储用于近期活跃文件，可被 Reader、QA、Survey 和 Agent 快速调用；归档存储用于长期保存低频文件，恢复到高速存储后才能用于高频任务。', en: 'High-speed storage keeps active files ready for Reader, QA, Survey, and Agent. Archive storage keeps lower-frequency files long term and requires restoration before high-frequency tasks.' })}</p>
            </div>
            <div className="faq-row">
              <h3>{text({ zh: '文件什么时候会自动归档？', en: 'When are files archived automatically?' })}</h3>
              <p>{text({ zh: '文件进入高速存储满 6 个月后会自动迁移至归档存储并释放额度；恢复文件后，6 个月保留期将重新计算。', en: 'Files move to archive storage after six months in high-speed storage, releasing capacity. Restoring a file restarts the six-month period.' })}</p>
            </div>
            <div className="faq-row">
              <h3>{text({ zh: '额外高速空间如何计费和取消？', en: 'How are storage add-ons billed and canceled?' })}</h3>
              <p>{text({ zh: '购买时立即扣除首月 Credits，之后按月自动扣除。取消后下个计费周期不再收费；扣费失败会进入宽限期，宽限期后仍未补足 Credits，系统会移除额外额度并优先归档低频文件。', en: 'The first month is charged immediately in Credits, followed by monthly renewal. Canceling stops the next charge. Failed payments enter a grace period; afterward, add-on capacity is removed and lower-frequency files are archived first if needed.' })}</p>
            </div>
            <div className="faq-row">
              <h3>{text({ zh: '充值包和套餐积分有什么区别？', en: 'How are top-up packs different from plan credits?' })}</h3>
              <p>{text({ zh: '套餐积分按周期发放，充值包用于按需补充 Credits；付费套餐可享对应充值折扣。', en: 'Plan credits are issued by billing cycle. Top-up packs add Credits on demand, and paid plans receive their corresponding top-up discounts.' })}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
