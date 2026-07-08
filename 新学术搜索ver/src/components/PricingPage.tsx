import React from 'react';
import { Check, Coins, HelpCircle, Minus } from 'lucide-react';

type BillingCycle = 'monthly' | 'annual';
type PaymentMethod = 'airwallex' | 'stripe' | 'airwallex-wallets' | 'stripe-wallets';

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
  { label: 'Quick Search', free: true, plus: true, pro: true, maxX2: true, maxX5: true },
  { label: 'Deep Search', free: true, plus: true, pro: true, maxX2: true, maxX5: true },
  { label: 'QA', free: true, plus: true, pro: true, maxX2: true, maxX5: true },
  { label: 'Feeds', free: true, plus: true, pro: true, maxX2: true, maxX5: true },
  { label: 'Survey', free: false, plus: false, pro: true, maxX2: true, maxX5: true },
  { label: 'Agent', free: true, plus: true, pro: true, maxX2: true, maxX5: true },
  { label: 'AI Index', free: '50K', plus: 'All', pro: 'All', maxX2: 'All', maxX5: 'All' },
  { label: '存储', free: '1GB', plus: '10GB', pro: '50GB', maxX2: '400GB', maxX5: '1TB' },
  { label: '额外充值折扣', free: false, plus: '8.8 折', pro: '5 折', maxX2: '5 折', maxX5: '5 折' },
];

function InfoLabel({ label, tooltip, dark = false }: { label: string; tooltip: string; dark?: boolean }) {
  return (
    <span className="uber-info-label">
      <span>{label}</span>
      <span className="uber-tooltip-wrap">
        <button type="button" className={`uber-tooltip-icon ${dark ? 'dark' : ''}`} aria-label={`${label}说明`}>
          <HelpCircle className="h-4 w-4" />
        </button>
        <span className="uber-tooltip-content" role="tooltip">
          {tooltip}
        </span>
      </span>
    </span>
  );
}

function Availability({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="uber-check" aria-label="包含">
        <Check className="h-4 w-4" />
      </span>
    );
  }

  if (value === false) {
    return (
      <span className="uber-minus" aria-label="不包含">
        <Minus className="h-4 w-4" />
      </span>
    );
  }

  return <span className="uber-table-value">{value}</span>;
}

interface PricingPageProps {
  onOpenRecharge?: () => void;
}

export function PricingPage({ onOpenRecharge }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>('monthly');
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('airwallex');
  const isAnnual = billingCycle === 'annual';

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
          max-width: 1480px;
          margin: 0 auto;
          padding: 24px 32px 72px;
        }

        .uber-pricing-page .section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin: 0 0 16px;
        }

        .uber-pricing-page .section-head h2 {
          margin: 0;
          font-size: 36px;
          line-height: 44px;
          font-weight: 700;
          letter-spacing: 0;
        }

        .uber-pricing-page .section-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .uber-pricing-page .billing-toggle {
          display: inline-flex;
          gap: 8px;
          padding: 6px;
          background: var(--line-blue);
          border-radius: 999px;
        }

        .uber-pricing-page .billing-toggle button {
          min-height: 40px;
          border: 0;
          border-radius: 999px;
          padding: 8px 16px;
          background: transparent;
          color: var(--ink);
          font-size: 14px;
          line-height: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        .uber-pricing-page .billing-toggle button.active {
          background: var(--accent);
          color: var(--on-primary);
          box-shadow: rgba(0, 121, 255, 0.18) 0 6px 18px;
        }

        .uber-pricing-page .renew-switch {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 52px;
          border: 0;
          border-radius: 999px;
          background: var(--line-blue);
          color: var(--ink);
          padding: 8px 14px 8px 16px;
          font-size: 14px;
          line-height: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        .uber-pricing-page .renew-track {
          position: relative;
          display: inline-flex;
          width: 46px;
          height: 28px;
          border-radius: 999px;
          background: var(--surface-pressed);
          transition: background 0.16s ease;
        }

        .uber-pricing-page .renew-track::after {
          content: "";
          position: absolute;
          top: 4px;
          left: 4px;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: var(--canvas);
          transition: transform 0.16s ease;
        }

        .uber-pricing-page .renew-switch.active .renew-track {
          background: var(--accent);
        }

        .uber-pricing-page .renew-switch.active .renew-track::after {
          transform: translateX(18px);
        }

        .uber-pricing-page .pricing-grid {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 2px 2px 18px;
          margin: 0 -2px;
          scroll-snap-type: x mandatory;
          scroll-padding: 2px;
          -webkit-overflow-scrolling: touch;
        }

        .uber-pricing-page .pricing-grid::-webkit-scrollbar { height: 10px; }
        .uber-pricing-page .pricing-grid::-webkit-scrollbar-track {
          background: var(--line-blue);
          border-radius: 999px;
        }
        .uber-pricing-page .pricing-grid::-webkit-scrollbar-thumb {
          background: rgba(0, 121, 255, 0.34);
          border-radius: 999px;
        }
        .uber-pricing-page .pricing-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 121, 255, 0.58);
        }

        .uber-pricing-page .plan {
          display: flex;
          flex-direction: column;
          flex: 0 0 320px;
          min-height: 520px;
          border-radius: 16px;
          padding: 24px;
          background: var(--canvas-soft);
          color: var(--ink);
          scroll-snap-align: start;
          border: 1px solid transparent;
        }

        .uber-pricing-page .plan.free {
          background: var(--canvas-soft);
        }

        .uber-pricing-page .plan.plus {
          background: linear-gradient(180deg, var(--canvas-softer) 0%, var(--canvas) 100%);
          border-color: var(--accent-soft-strong);
        }

        .uber-pricing-page .plan.featured {
          background: var(--primary);
          color: var(--on-primary);
          box-shadow: rgba(35, 40, 47, 0.2) 0 18px 40px;
        }

        .uber-pricing-page .plan.max {
          background: var(--canvas);
          border-color: var(--line);
        }

        .uber-pricing-page .plan.max-x5 {
          background: linear-gradient(180deg, var(--canvas-softer) 0%, var(--canvas) 72%);
          border-color: var(--accent-soft-strong);
        }

        .uber-pricing-page .plan-tag {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          min-height: 32px;
          margin-bottom: 16px;
          border-radius: 999px;
          padding: 8px 16px;
          background: var(--canvas);
          color: var(--ink);
          font-size: 14px;
          line-height: 16px;
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
          background: var(--accent-soft-strong);
          color: var(--accent-deep);
        }

        .uber-pricing-page .plan h3 {
          margin: 0;
          font-size: 24px;
          line-height: 32px;
          font-weight: 700;
        }

        .uber-pricing-page .plan-subtitle {
          min-height: 48px;
          margin: 8px 0 24px;
          color: var(--body);
          font-size: 16px;
          line-height: 24px;
        }

        .uber-pricing-page .plan.featured .plan-subtitle,
        .uber-pricing-page .plan.featured .muted,
        .uber-pricing-page .plan.featured .uber-info-label {
          color: rgba(255, 255, 255, 0.72);
        }

        .uber-pricing-page .info-list {
          display: grid;
          gap: 8px;
          margin: 24px 0 0;
        }

        .uber-pricing-page .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 48px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(99, 108, 118, 0.16);
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
          gap: 6px;
          color: var(--body);
          font-weight: 500;
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
          width: 20px;
          height: 20px;
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
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid rgba(99, 108, 118, 0.18);
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
          font-size: 52px;
          line-height: 64px;
          font-weight: 700;
        }

        .uber-pricing-page .price span {
          padding-bottom: 14px;
          color: var(--body);
          font-size: 16px;
          line-height: 24px;
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
          min-height: 44px;
          border: 0;
          border-radius: 999px;
          padding: 12px 16px;
          background: var(--accent);
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
          margin: 16px 0 20px;
        }

        .uber-pricing-page .plan-cta:hover,
        .uber-pricing-page .pill-button:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
        }

        .uber-pricing-page .plan-cta.secondary,
        .uber-pricing-page .pill-button.secondary {
          background: var(--canvas);
          color: var(--ink);
        }

        .uber-pricing-page .pill-button.secondary {
          background: var(--line-blue);
        }

        .uber-pricing-page .plan.plus .plan-cta.secondary {
          background: var(--accent);
          color: var(--on-primary);
        }

        .uber-pricing-page .plan-cta.secondary:hover,
        .uber-pricing-page .pill-button.secondary:hover {
          background: var(--accent-soft-strong);
        }

        .uber-pricing-page .plan.plus .plan-cta.secondary:hover {
          background: var(--accent-hover);
        }

        .uber-pricing-page .payment-methods {
          margin: 24px 0 0;
          padding: 24px 0 0;
          border-top: 1px solid rgba(99, 108, 118, 0.16);
        }

        .uber-pricing-page .payment-methods h3 {
          margin: 0 0 18px;
          text-align: center;
          color: var(--ink);
          font-size: 24px;
          line-height: 32px;
          font-weight: 700;
        }

        .uber-pricing-page .payment-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(180px, 1fr));
          gap: 16px;
        }

        .uber-pricing-page .payment-option {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 82px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.86);
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
          font-size: 28px;
          line-height: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .uber-pricing-page .airwallex-mark {
          display: inline-flex;
          align-items: center;
          color: #f05245;
          font-size: 28px;
          font-weight: 900;
          transform: rotate(-8deg);
        }

        .uber-pricing-page .stripe-brand {
          color: #635bff;
          font-size: 30px;
          line-height: 32px;
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
          margin-top: 56px;
        }

        .uber-pricing-page .table-shell {
          overflow-x: auto;
          background: rgba(255, 255, 255, 0.68);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .uber-pricing-page table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
          font-size: 14px;
          line-height: 20px;
        }

        .uber-pricing-page th,
        .uber-pricing-page td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--line);
          text-align: center;
        }

        .uber-pricing-page th:first-child,
        .uber-pricing-page td:first-child {
          width: 30%;
          text-align: left;
          font-weight: 500;
        }

        .uber-pricing-page th {
          background: var(--canvas-softer);
          font-size: 14px;
          line-height: 16px;
          font-weight: 500;
        }

        .uber-pricing-page .uber-check,
        .uber-pricing-page .uber-minus {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 999px;
        }

        .uber-pricing-page .uber-check {
          background: var(--accent-soft-strong);
          color: var(--accent);
        }

        .uber-pricing-page .uber-minus {
          background: var(--canvas-soft);
          color: var(--body);
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

        .uber-pricing-page .faq {
          margin-top: 56px;
          display: grid;
          grid-template-columns: minmax(220px, 0.55fr) minmax(0, 1fr);
          gap: 32px;
        }

        .uber-pricing-page .faq h2 {
          margin: 0;
          font-size: 36px;
          line-height: 44px;
          font-weight: 700;
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
          .uber-pricing-page .plan { flex-basis: 312px; }
        }

        @media (max-width: 720px) {
          .uber-pricing-page .page {
            padding: 24px 16px 56px;
          }

          .uber-pricing-page .section-head,
          .uber-pricing-page .dark-band {
            align-items: stretch;
            grid-template-columns: 1fr;
            flex-direction: column;
          }

          .uber-pricing-page .pill-button,
          .uber-pricing-page .billing-toggle,
          .uber-pricing-page .section-controls,
          .uber-pricing-page .renew-switch {
            width: 100%;
          }

          .uber-pricing-page .billing-toggle {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .uber-pricing-page .faq {
            grid-template-columns: 1fr;
          }

          .uber-pricing-page .payment-grid {
            grid-template-columns: 1fr;
          }

          .uber-pricing-page .plan {
            flex-basis: min(86vw, 340px);
            min-height: 500px;
          }
        }
      `}</style>

      <main className="page">
        <section id="plans" aria-label="Pricing plans">
          <div className="section-head">
            <h2>Pricing & Plans</h2>
            <div className="section-controls">
              <div className="billing-toggle" role="group" aria-label="计费周期">
                <button
                  type="button"
                  className={billingCycle === 'monthly' ? 'active' : ''}
                  onClick={() => setBillingCycle('monthly')}
                >
                  月付
                </button>
                <button
                  type="button"
                  className={billingCycle === 'annual' ? 'active' : ''}
                  onClick={() => setBillingCycle('annual')}
                >
                  年付省 15%
                </button>
              </div>
              <button
                type="button"
                className={`renew-switch ${autoRenew ? 'active' : ''}`}
                role="switch"
                aria-checked={autoRenew}
                onClick={() => setAutoRenew((current) => !current)}
              >
                <span>连续订阅：{autoRenew ? '开' : '关'}</span>
                <span className="renew-track" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="pricing-grid">
            <article className="plan free">
              <span className="plan-tag">Free</span>
              <h3>Free</h3>
              <p className="plan-subtitle">体验搜索、问答和基础 Agent 能力。</p>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label="可用积分" tooltip="注册赠送 + 新手任务奖励。" />
                  <strong>300 + 300</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label="每日积分" tooltip="每日登录后发放，用于当天基础体验。" />
                  <strong>200</strong>
                </div>
                <div className="info-row">
                  <span className="uber-info-label">存储</span>
                  <strong>1GB</strong>
                </div>
              </div>
              <div className="price-action">
                <p className="price"><strong>$0</strong><span>/ mo</span></p>
                <p className="muted">免费使用</p>
                <a className="plan-cta secondary" href="#">开始体验</a>
              </div>
            </article>

            <article className="plan plus">
              <span className="plan-tag">Most popular</span>
              <h3>Plus</h3>
              <p className="plan-subtitle">适合每周稳定检索和轻量问答。</p>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label="每月积分" tooltip="按订阅周期发放，到期后未使用余额将清零。" />
                  <strong>10,000</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label="每日积分" tooltip="由基础每日额度和登录奖励组成。" />
                  <strong>200 + 200</strong>
                </div>
                <div className="info-row">
                  <span className="uber-info-label">存储</span>
                  <strong>10GB</strong>
                </div>
              </div>
              <div className="price-action">
                <p className="price"><strong>{isAnnual ? '$4.25' : '$5'}</strong><span>/ mo</span></p>
                <p className="muted">{isAnnual ? '约 ¥30 / mo，按年计费' : '约 ¥35 / mo'}</p>
                <a className="plan-cta secondary" href="#">支付 Plus</a>
              </div>
            </article>

            <article className="plan featured">
              <span className="plan-tag">Best value</span>
              <h3>Pro</h3>
              <p className="plan-subtitle">最适合日常深度研究和 Agent 任务。</p>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label="每月积分" tooltip="按订阅周期发放，到期后未使用余额将清零。" dark />
                  <strong>160,000</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label="每日积分" tooltip="Pro 基础每日额度更高，登录奖励另计。" dark />
                  <strong>500 + 200</strong>
                </div>
                <div className="info-row">
                  <span className="uber-info-label">存储</span>
                  <strong>50GB</strong>
                </div>
              </div>
              <div className="price-action">
                <p className="price"><strong>{isAnnual ? '$17' : '$20'}</strong><span>/ mo</span></p>
                <p className="muted">{isAnnual ? '约 ¥128 / mo，按年计费' : '约 ¥150 / mo'}</p>
                <a className="plan-cta secondary" href="#">支付 Pro</a>
              </div>
            </article>

            <article className="plan max max-x2">
              <span className="plan-tag">For teams</span>
              <h3>Max x2</h3>
              <p className="plan-subtitle">高频 Agent 使用、多项目协作和更高存储需求。</p>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label="每月积分" tooltip="按订阅周期发放，到期后未使用余额将清零。" />
                  <strong>{maxPlans.x2.monthly}</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label="每日积分" tooltip="基础每日额度随档位提升，登录奖励另计。" />
                  <strong>{maxPlans.x2.passive} + 200</strong>
                </div>
                <div className="info-row">
                  <span className="uber-info-label">存储</span>
                  <strong>50GB + {maxPlans.x2.projectStorage}</strong>
                </div>
              </div>
              <div className="price-action">
                <p className="price"><strong>{isAnnual ? maxPlans.x2.annualPrice : maxPlans.x2.price}</strong><span>/ mo</span></p>
                <p className="muted">{isAnnual ? `${maxPlans.x2.annualRmb}，按年计费` : maxPlans.x2.rmb}</p>
                <a className="plan-cta" href="#">支付 Max x2</a>
              </div>
            </article>

            <article className="plan max max-x5">
              <span className="plan-tag">For teams</span>
              <h3>Max x5</h3>
              <p className="plan-subtitle">满足高存储需求和更高频 Agent 工作流。</p>
              <div className="info-list">
                <div className="info-row">
                  <InfoLabel label="每月积分" tooltip="按订阅周期发放，到期后未使用余额将清零。" />
                  <strong>{maxPlans.x5.monthly}</strong>
                </div>
                <div className="info-row">
                  <InfoLabel label="每日积分" tooltip="基础每日额度随档位提升，登录奖励另计。" />
                  <strong>{maxPlans.x5.passive} + 200</strong>
                </div>
                <div className="info-row">
                  <span className="uber-info-label">存储</span>
                  <strong>50GB + {maxPlans.x5.projectStorage}</strong>
                </div>
              </div>
              <div className="price-action">
                <p className="price"><strong>{isAnnual ? maxPlans.x5.annualPrice : maxPlans.x5.price}</strong><span>/ mo</span></p>
                <p className="muted">{isAnnual ? `${maxPlans.x5.annualRmb}，按年计费` : maxPlans.x5.rmb}</p>
                <a className="plan-cta" href="#">支付 Max x5</a>
              </div>
            </article>
          </div>

          <div className="payment-methods" aria-label="选择支付方式">
            <h3>选择支付方式</h3>
            <div className="payment-grid" role="radiogroup" aria-label="支付方式">
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
                <span className="wallets" aria-label="微信支付和支付宝">
                  <span className="wallet-badge wechat">微</span>
                  <span className="wallet-badge alipay">支</span>
                </span>
              </button>
              <button type="button" className={`payment-option ${paymentMethod === 'stripe-wallets' ? 'active' : ''}`} role="radio" aria-checked={paymentMethod === 'stripe-wallets'} onClick={() => setPaymentMethod('stripe-wallets')}>
                <span className="stripe-brand">stripe</span>
                <span className="payment-plus">+</span>
                <span className="wallets" aria-label="微信支付和支付宝">
                  <span className="wallet-badge wechat">微</span>
                  <span className="wallet-badge alipay">支</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="compare" aria-labelledby="compare-title">
          <div className="section-head">
            <h2 id="compare-title">Compare plans</h2>
            <button type="button" className="pill-button secondary" onClick={onOpenRecharge}>
              <Coins className="h-4 w-4" />
              Credits 充值包
            </button>
          </div>
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th>Plus</th>
                  <th>Pro</th>
                  <th>Max x2</th>
                  <th>Max x5</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td><Availability value={row.free} /></td>
                    <td><Availability value={row.plus} /></td>
                    <td><Availability value={row.pro} /></td>
                    <td><Availability value={row.maxX2} /></td>
                    <td><Availability value={row.maxX5} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dark-band" aria-label="Recharge callout">
          <div>
            <h2>Need more Credits between plans?</h2>
            <p>充值包可按需补充任务额度。Plus、Pro 和 Max 用户会自动获得对应充值折扣。</p>
          </div>
          <button type="button" className="pill-button" onClick={onOpenRecharge}>
            购买充值包
          </button>
        </section>

        <section className="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Pricing FAQ</h2>
          <div className="faq-list">
            <div className="faq-row">
              <h3>积分如何消耗？</h3>
              <p>积分用于 Search、Survey、QA、Feeds 和 Agent 等任务，不同任务会根据复杂度消耗不同积分。</p>
            </div>
            <div className="faq-row">
              <h3>Max 的存储包含什么？</h3>
              <p>Max 包含 50GB 知识库存储，并额外提供 Projects 存储空间，x2 为 400GB，x5 为 1TB。</p>
            </div>
            <div className="faq-row">
              <h3>充值包和套餐积分有什么区别？</h3>
              <p>套餐积分按周期发放，充值包用于按需补充 Credits；付费套餐可享对应充值折扣。</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
