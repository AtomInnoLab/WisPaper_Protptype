import React from 'react';
import { Check, ChevronDown, HelpCircle, Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type BillingCycle = 'monthly' | 'annual';
type PaymentMethod = 'airwallex' | 'stripe' | 'airwallex-wallets' | 'stripe-wallets';
type LocalizedText = { zh: string; en: string };
type LocalizedPrice = { zh: number; en: number };
type ComparisonValue = boolean | string | LocalizedText;
type StoragePlanKey = 'pro' | 'maxX2' | 'maxX5';
type MaxTier = 'x2' | 'x5';

const ANNUAL_STORAGE_DISCOUNT = 0.85;

const createStorageOptions = (baseStorageGb: number) =>
  Array.from({ length: 4 }, (_, index) => baseStorageGb * (index + 1));

const formatStorage = (storageGb: number) => {
  if (storageGb < 1000) return `${storageGb} GB`;
  const storageTb = storageGb / 1000;
  return `${Number.isInteger(storageTb) ? storageTb : Number(storageTb.toFixed(1))} TB`;
};

const getExtraStoragePrice = (
  storageGb: number,
  baseStorageGb: number,
  language: 'zh' | 'en',
) => (Math.max(storageGb - baseStorageGb, 0) / 10) * (language === 'zh' ? 6 : 1);

const formatCurrency = (amount: number, language: 'zh' | 'en') => {
  const formattedAmount = amount.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
    maximumFractionDigits: 2,
  });
  return language === 'zh' ? `¥${formattedAmount}` : `$${formattedAmount}`;
};

const formatPlanPrice = (
  price: LocalizedPrice,
  language: 'zh' | 'en',
  storageGb?: number,
  baseStorageGb?: number,
  storageDiscount = 1,
  roundUp = false,
) => {
  const total = price[language] + (
    storageGb !== undefined && baseStorageGb !== undefined
      ? getExtraStoragePrice(storageGb, baseStorageGb, language) * storageDiscount
      : 0
  );

  return formatCurrency(roundUp ? Math.ceil(total) : total, language);
};

const formatAnnualTotal = (
  price: LocalizedPrice,
  language: 'zh' | 'en',
  storageGb?: number,
  baseStorageGb?: number,
) => {
  const total = price[language] + (
    storageGb !== undefined && baseStorageGb !== undefined
      ? getExtraStoragePrice(storageGb, baseStorageGb, language) * 12 * ANNUAL_STORAGE_DISCOUNT
      : 0
  );

  return formatCurrency(Math.ceil(total), language);
};

const formatAnnualBilling = (total: string, language: 'zh' | 'en') =>
  language === 'zh' ? `年付总计 ${total}` : `${total} billed yearly`;

const formatStoragePrice = (
  storageGb: number,
  baseStorageGb: number,
  language: 'zh' | 'en',
) => {
  const extraStorageGb = Math.max(storageGb - baseStorageGb, 0);

  if (extraStorageGb === 0) {
    return language === 'zh' ? '基础存储' : 'Base storage';
  }

  const price = getExtraStoragePrice(storageGb, baseStorageGb, language);
  return language === 'zh'
    ? `+${formatCurrency(price, language)} / 月`
    : `+${formatCurrency(price, language)} / mo`;
};

const copy = (text: LocalizedText, language: 'zh' | 'en') => text[language];

const miniPack = {
  price: { zh: 14, en: 1.99 },
  credits: '10,000',
};

const planPrices = {
  free: {
    monthly: { zh: 0, en: 0 },
    annual: { zh: 0, en: 0 },
    annualTotal: { zh: 0, en: 0 },
  },
  plus: {
    monthly: { zh: 35, en: 5 },
    annual: { zh: 30, en: 4.2 },
    annualTotal: { zh: 360, en: 50 },
  },
  pro: {
    monthly: { zh: 150, en: 20 },
    annual: { zh: 105, en: 15 },
    annualTotal: { zh: 1260, en: 180 },
  },
};

const maxPlans = {
  x2: {
    price: { zh: 300, en: 40 },
    annualPrice: { zh: 225, en: 30 },
    annualTotal: { zh: 2700, en: 360 },
    monthly: '400,000',
    passive: '1,000',
    projectStorage: '100GB',
  },
  x5: {
    price: { zh: 750, en: 100 },
    annualPrice: { zh: 565, en: 75 },
    annualTotal: { zh: 6780, en: 900 },
    monthly: '1,000,000',
    passive: '2,500',
    projectStorage: '250GB',
  },
};

const comparisonRows = [
  { label: { zh: '快速搜索', en: 'Quick Search' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: '深度搜索', en: 'Deep Search' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: '问答', en: 'QA' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: '信息流', en: 'Feeds' }, free: true, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: { zh: '额外 XXXX 积分', en: 'Extra XXXX credits' }, standard: { zh: '额外 XXXX 积分', en: 'Extra XXXX credits' } },
  { label: { zh: '调研综述', en: 'Survey' }, free: false, plus: false, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: 'Agent', en: 'Agent' }, free: false, plus: true, pro: true, maxX2: true, maxX5: true, miniPack: false, standard: false },
  { label: { zh: 'AI 索引', en: 'AI Index' }, free: '50K', plus: { zh: '全部', en: 'All' }, pro: { zh: '全部', en: 'All' }, maxX2: { zh: '全部', en: 'All' }, maxX5: { zh: '全部', en: 'All' }, miniPack: false, standard: false },
  { label: { zh: '基础高速存储', en: 'Base high-speed storage' }, free: '1GB', plus: '10GB', pro: '50GB', maxX2: '100GB', maxX5: '250GB', miniPack: false, standard: false },
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

function PlanStorageSelector({
  baseStorageGb,
  value,
  isOpen,
  dark = false,
  language,
  onToggle,
  onChange,
}: {
  baseStorageGb: number;
  value: number;
  isOpen: boolean;
  dark?: boolean;
  language: 'zh' | 'en';
  onToggle: () => void;
  onChange: (value: number) => void;
}) {
  const label = language === 'zh' ? '高速存储' : 'High-speed storage';
  const storageOptions = createStorageOptions(baseStorageGb);

  return (
    <div className={`plan-storage-selector ${dark ? 'dark' : ''}`}>
      <button
        type="button"
        className="plan-storage-trigger"
        aria-expanded={isOpen}
        aria-label={`${label} ${formatStorage(value)}`}
        onClick={onToggle}
      >
        <span className="plan-storage-trigger-copy">
          <strong>{label} {formatStorage(value)}</strong>
        </span>
        <ChevronDown className={`h-4 w-4 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="plan-storage-options" role="radiogroup" aria-label={label}>
          {storageOptions.map((storageGb) => (
            <button
              key={storageGb}
              type="button"
              role="radio"
              aria-checked={value === storageGb}
              className={`plan-storage-option ${value === storageGb ? 'selected' : ''}`}
              onClick={() => onChange(storageGb)}
            >
              <span className="plan-storage-option-capacity">{formatStorage(storageGb)}</span>
              <span className="plan-storage-option-meta">
                <small>{formatStoragePrice(storageGb, baseStorageGb, language)}</small>
                {value === storageGb ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
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
  const [maxTier, setMaxTier] = React.useState<MaxTier>('x2');
  const [openStoragePlan, setOpenStoragePlan] = React.useState<StoragePlanKey | null>(null);
  const [planStorage, setPlanStorage] = React.useState<Record<StoragePlanKey, number>>({
    pro: 50,
    maxX2: 100,
    maxX5: 250,
  });
  const isAnnual = billingCycle === 'annual';
  const text = (localized: LocalizedText) => copy(localized, language);
  const activeMaxPlan = maxPlans[maxTier];
  const activeMaxStorageKey: StoragePlanKey = maxTier === 'x2' ? 'maxX2' : 'maxX5';
  const activeMaxBaseStorage = maxTier === 'x2' ? 100 : 250;
  const activeMaxStorage = planStorage[activeMaxStorageKey];
  const activeMaxName = maxTier === 'x2' ? 'Max x2' : 'Max x5';

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
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: flex-start;
          gap: 24px;
          padding: 0;
          margin: 0;
        }

        .uber-pricing-page .plan {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          min-height: 424px;
          border-radius: 12px;
          padding: 20px;
          background: var(--canvas);
          color: var(--ink);
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

        .uber-pricing-page .max-tier-switch {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          margin-left: auto;
          padding: 3px;
          border-radius: 999px;
          background: var(--canvas-soft);
        }

        .uber-pricing-page .max-tier-switch button {
          min-width: 42px;
          min-height: 26px;
          border: 0;
          border-radius: 999px;
          padding: 3px 10px;
          background: transparent;
          color: var(--body);
          font: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease;
        }

        .uber-pricing-page .max-tier-switch button:hover {
          color: var(--ink);
        }

        .uber-pricing-page .max-tier-switch button.active {
          background: var(--canvas);
          color: var(--ink);
          box-shadow: rgba(35, 40, 47, 0.1) 0 2px 8px;
        }

        .uber-pricing-page .max-tier-switch button:focus-visible,
        .uber-pricing-page .downgrade-button:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .uber-pricing-page .current-plan-status {
          position: absolute;
          top: 8px;
          right: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--body);
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
        }

        .uber-pricing-page .downgrade-button {
          min-height: 32px;
          border: 0;
          border-radius: 8px;
          padding: 6px 10px;
          background: transparent;
          color: var(--ink);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.16s ease, color 0.16s ease, background 0.16s ease;
        }

        .uber-pricing-page .downgrade-button:hover {
          border-color: #cbd1d8;
          background: var(--canvas-soft);
          color: var(--ink);
        }

        .uber-pricing-page .recharge-products-section {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--line);
        }

        .uber-pricing-page .recharge-products-grid {
          display: grid;
          grid-template-columns: minmax(280px, 360px);
          gap: 24px;
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

        .uber-pricing-page .plan-storage-selector {
          position: relative;
          margin-top: 10px;
        }

        .uber-pricing-page .plan-storage-trigger {
          display: flex;
          width: 100%;
          min-height: 42px;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: var(--canvas-soft);
          color: var(--ink);
          padding: 9px 12px;
          font-size: 13px;
          line-height: 18px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.16s ease, background 0.16s ease;
        }

        .uber-pricing-page .plan-storage-trigger:hover {
          border-color: rgba(0, 121, 255, 0.34);
          background: var(--accent-soft);
        }

        .uber-pricing-page .plan-storage-trigger:focus-visible,
        .uber-pricing-page .plan-storage-option:focus-visible {
          outline: 3px solid rgba(0, 121, 255, 0.22);
          outline-offset: 2px;
        }

        .uber-pricing-page .plan-storage-trigger svg {
          flex: 0 0 auto;
          transition: transform 0.16s ease;
        }

        .uber-pricing-page .plan-storage-trigger-copy {
          display: grid;
          min-width: 0;
          gap: 2px;
        }

        .uber-pricing-page .plan-storage-trigger-copy strong {
          font-size: 13px;
          line-height: 18px;
          font-weight: 600;
        }

        .uber-pricing-page .plan-storage-trigger-copy small,
        .uber-pricing-page .plan-storage-option-meta small {
          color: var(--body);
          font-size: 11px;
          line-height: 15px;
          font-weight: 500;
        }

        .uber-pricing-page .plan-storage-options {
          display: grid;
          max-height: 248px;
          margin-top: 8px;
          overflow-y: auto;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: var(--canvas);
          padding: 6px;
          box-shadow: rgba(35, 40, 47, 0.12) 0 16px 34px;
        }

        .uber-pricing-page .plan-storage-option {
          display: flex;
          width: 100%;
          min-height: 38px;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: var(--ink);
          padding: 8px 10px;
          font-size: 13px;
          line-height: 18px;
          text-align: left;
          cursor: pointer;
          transition: background 0.14s ease, color 0.14s ease;
        }

        .uber-pricing-page .plan-storage-option:hover,
        .uber-pricing-page .plan-storage-option.selected {
          background: var(--canvas-soft);
        }

        .uber-pricing-page .plan-storage-option.selected {
          color: var(--accent-deep);
          font-weight: 600;
        }

        .uber-pricing-page .plan-storage-option-capacity {
          font-variant-numeric: tabular-nums;
          font-weight: 600;
        }

        .uber-pricing-page .plan-storage-option-meta {
          display: inline-flex;
          min-width: 92px;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          text-align: right;
          white-space: nowrap;
        }

        .uber-pricing-page .plan-storage-selector.dark .plan-storage-trigger {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .uber-pricing-page .plan-storage-selector.dark .plan-storage-trigger:hover {
          border-color: rgba(255, 255, 255, 0.38);
          background: rgba(255, 255, 255, 0.16);
        }

        .uber-pricing-page .plan-storage-selector.dark .plan-storage-options {
          border-color: rgba(255, 255, 255, 0.18);
          background: #30363e;
        }

        .uber-pricing-page .plan-storage-selector.dark .plan-storage-option {
          color: rgba(255, 255, 255, 0.84);
        }

        .uber-pricing-page .plan-storage-selector.dark .plan-storage-trigger-copy small,
        .uber-pricing-page .plan-storage-selector.dark .plan-storage-option-meta small {
          color: rgba(255, 255, 255, 0.66);
        }

        .uber-pricing-page .plan-storage-selector.dark .plan-storage-option:hover,
        .uber-pricing-page .plan-storage-selector.dark .plan-storage-option.selected {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
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
          .uber-pricing-page .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 720px) {
          .uber-pricing-page .page {
            padding: 24px 16px 56px;
          }

          .uber-pricing-page .section-head {
            min-height: 196px;
          }

          .uber-pricing-page .section-head h2 {
            font-size: 32px;
            line-height: 40px;
          }

          .uber-pricing-page .section-controls {
            top: 104px;
          }

          .uber-pricing-page .current-plan-status {
            top: 56px;
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
          .uber-pricing-page .storage-pricing-section,
          .uber-pricing-page .pricing-grid,
          .uber-pricing-page .recharge-products-grid {
            grid-template-columns: 1fr;
          }

          .uber-pricing-page .redeem-ticket {
            grid-template-columns: 1fr;
          }

        }
      `}</style>

      <main className="page">
        <section id="plans" aria-label={text({ zh: '定价套餐', en: 'Pricing plans' })}>
          <div className="section-head">
            <h2>{text({ zh: '定价与套餐', en: 'Pricing & Plans' })}</h2>
            <div className="current-plan-status">
              <span>{text({ zh: '当前等级：Pro', en: 'Current plan: Pro' })}</span>
              <button type="button" className="downgrade-button">
                {text({ zh: '降级为 Free', en: 'Downgrade to Free' })}
              </button>
            </div>
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
            <article className="plan plus">
              <div className="plan-title-row">
                <h3>Plus</h3>
                <span className="plan-tag">{text({ zh: '最受欢迎', en: 'Most popular' })}</span>
              </div>
              <p className="plan-subtitle">{text({ zh: '适合每周稳定检索和轻量问答', en: 'For steady weekly search and lightweight QA' })}</p>
              <div className="price-action">
                <p className="price"><strong>{formatPlanPrice(isAnnual ? planPrices.plus.annual : planPrices.plus.monthly, language)}</strong><span>{text({ zh: '/ 月', en: '/ month' })}</span></p>
                {isAnnual ? <p className="muted">{formatAnnualBilling(formatAnnualTotal(planPrices.plus.annualTotal, language), language)}</p> : null}
                <a className="plan-cta secondary" href="#">{text({ zh: '订阅 Plus', en: 'Subscribe to Plus' })}</a>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每月积分', en: 'Monthly credits' })} tooltip={text({ zh: '按订阅周期发放，到期后未使用余额将清零。', en: 'Issued per billing cycle. Unused balance expires when the cycle ends.' })} language={language} />
                  <strong>10,000</strong>
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
                <p className="price"><strong>{formatPlanPrice(isAnnual ? planPrices.pro.annual : planPrices.pro.monthly, language, planStorage.pro, 50, isAnnual ? ANNUAL_STORAGE_DISCOUNT : 1, isAnnual)}</strong><span>{text({ zh: '/ 月', en: '/ month' })}</span></p>
                {isAnnual ? <p className="muted">{formatAnnualBilling(formatAnnualTotal(planPrices.pro.annualTotal, language, planStorage.pro, 50), language)}</p> : null}
                <a className="plan-cta secondary" href="#">{text({ zh: '订阅 Pro', en: 'Subscribe to Pro' })}</a>
                <PlanStorageSelector
                  baseStorageGb={50}
                  value={planStorage.pro}
                  isOpen={openStoragePlan === 'pro'}
                  dark
                  language={language}
                  onToggle={() => setOpenStoragePlan((current) => current === 'pro' ? null : 'pro')}
                  onChange={(value) => {
                    setPlanStorage((current) => ({ ...current, pro: value }));
                    setOpenStoragePlan(null);
                  }}
                />
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每月积分', en: 'Monthly credits' })} tooltip={text({ zh: '按订阅周期发放，到期后未使用余额将清零。', en: 'Issued per billing cycle. Unused balance expires when the cycle ends.' })} dark language={language} />
                  <strong>200,000</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label={text({ zh: '基础高速存储', en: 'Base high-speed storage' })} tooltip={text({ zh: '用于 Reader、QA、Survey 和 Agent 快速调用，文件保留满 6 个月后自动归档。', en: 'Used for fast access by Reader, QA, Survey, and Agent. Files archive after six months.' })} dark language={language} />
                  <strong>50 GB</strong>
                </div>
              </div>
            </article>

            <article className="plan max">
              <div className="plan-title-row">
                <h3>Max</h3>
                <div className="max-tier-switch" role="tablist" aria-label={text({ zh: 'Max 规格', en: 'Max tier' })}>
                  {(['x2', 'x5'] as MaxTier[]).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      role="tab"
                      aria-selected={maxTier === tier}
                      className={maxTier === tier ? 'active' : ''}
                      onClick={() => {
                        setMaxTier(tier);
                        setOpenStoragePlan(null);
                      }}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
              <p className="plan-subtitle">{text({ zh: '高频 Agent 使用、多项目协作和高存储需求', en: 'For frequent Agent usage, multi-project collaboration, and high storage needs' })}</p>
              <div className="price-action">
                <p className="price"><strong>{formatPlanPrice(isAnnual ? activeMaxPlan.annualPrice : activeMaxPlan.price, language, activeMaxStorage, activeMaxBaseStorage, isAnnual ? ANNUAL_STORAGE_DISCOUNT : 1, isAnnual)}</strong><span>{text({ zh: '/ 月', en: '/ month' })}</span></p>
                {isAnnual ? <p className="muted">{formatAnnualBilling(formatAnnualTotal(activeMaxPlan.annualTotal, language, activeMaxStorage, activeMaxBaseStorage), language)}</p> : null}
                <a className="plan-cta" href="#">{text({ zh: `订阅 ${activeMaxName}`, en: `Subscribe to ${activeMaxName}` })}</a>
                <PlanStorageSelector
                  baseStorageGb={activeMaxBaseStorage}
                  value={activeMaxStorage}
                  isOpen={openStoragePlan === activeMaxStorageKey}
                  language={language}
                  onToggle={() => setOpenStoragePlan((current) => current === activeMaxStorageKey ? null : activeMaxStorageKey)}
                  onChange={(value) => {
                    setPlanStorage((current) => ({ ...current, [activeMaxStorageKey]: value }));
                    setOpenStoragePlan(null);
                  }}
                />
              </div>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label={text({ zh: '每月积分', en: 'Monthly credits' })} tooltip={text({ zh: '按订阅周期发放，到期后未使用余额将清零。', en: 'Issued per billing cycle. Unused balance expires when the cycle ends.' })} language={language} />
                  <strong>{activeMaxPlan.monthly}</strong>
                </div>
                <div className="info-row">
                  <InfoLabel
                    label={text({ zh: '基础高速存储', en: 'Base high-speed storage' })}
                    tooltip={text({
                      zh: `${activeMaxName} 包含 ${formatStorage(activeMaxBaseStorage)} 基础高速存储，归档存储用于长期保存低频文件。`,
                      en: `${activeMaxName} includes ${formatStorage(activeMaxBaseStorage)} of base high-speed storage. Archive storage keeps lower-frequency files long term.`,
                    })}
                    language={language}
                  />
                  <strong>{formatStorage(activeMaxBaseStorage)}</strong>
                </div>
              </div>
            </article>
          </div>

          <section className="recharge-products-section" aria-label={text({ zh: '充值包商品', en: 'Credit pack products' })}>
            <div className="recharge-products-grid">
              <article className="plan mini-pack">
              <div className="plan-title-row">
                <h3>Mini Pack</h3>
              </div>
              <p className="plan-subtitle">{text({ zh: '按需补充积分，适合临时高峰任务', en: 'Add credits on demand for temporary workload spikes' })}</p>
              <div className="price-action">
                <p className="price"><strong>{formatPlanPrice(miniPack.price, language)}</strong><span>{text({ zh: '一次性', en: 'one-time' })}</span></p>
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
                  <span className="uber-info-label">{text({ zh: '包含积分', en: 'Credits included' })}</span>
                  <strong>{miniPack.credits}</strong>
                </div>
                <div className="info-row">
                  <span className="uber-info-label">{text({ zh: '购买类型', en: 'Purchase type' })}</span>
                  <strong>{text({ zh: '一次性购买', en: 'One-time purchase' })}</strong>
                </div>
                <div className="info-row">
                  <span className="uber-info-label">{text({ zh: '有效期', en: 'Validity' })}</span>
                  <strong>{text({ zh: '一年有效', en: 'Valid for one year' })}</strong>
                </div>
              </div>
              </article>
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
              <h3>{text({ zh: '高速存储规格如何计费和调整？', en: 'How is the high-speed storage tier billed and changed?' })}</h3>
              <p>{text({ zh: '存储规格与会员套餐使用相同支付方式，并随会员统一续期。升级容量立即生效；降低容量将在下个计费周期生效。', en: 'The storage tier uses the membership payment method and renews with the plan. Upgrades take effect immediately; reductions take effect next cycle.' })}</p>
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
