import React from 'react';
import { Coins } from 'lucide-react';

type MaxTier = 'x2' | 'x5';

const maxPlans = {
  x2: {
    price: '$40',
    rmb: '约 ¥300 / mo',
    monthly: '320,000',
    passive: '1,000',
    usage: '7,200 次',
    projectStorage: '400GB',
    cta: '升级 Max x2',
  },
  x5: {
    price: '$100',
    rmb: '约 ¥750 / mo',
    monthly: '800,000',
    passive: '2,500',
    usage: '18,000 次',
    projectStorage: '1TB',
    cta: '升级 Max x5',
  },
};

function InfoLabel({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <span className="info-label">
      <span>{label}</span>
      <span className="tooltip-wrap">
        <button type="button" className="tooltip-icon" aria-label={`${label}说明`}>
          ?
        </button>
        <span className="tooltip-content" role="tooltip">
          {tooltip}
        </span>
      </span>
    </span>
  );
}

interface PricingPageProps {
  onOpenRecharge?: () => void;
}

export function PricingPage({ onOpenRecharge }: PricingPageProps) {
  const [maxTier, setMaxTier] = React.useState<MaxTier>('x2');
  const maxPlan = maxPlans[maxTier];

  return (
    <div className="pricing-html-page">
      <style>{`
        .pricing-html-page {
          --bg: #f6f7fb;
          --card: #ffffff;
          --text: #171717;
          --muted: #6b7280;
          --line: #e5e7eb;
          --primary: #2563eb;
          --primary-soft: #eff6ff;
          --green: #16a34a;
          --green-soft: #ecfdf5;
          --orange: #f97316;
          --purple: #7c3aed;
          --purple-soft: #f5f3ff;
          --red-soft: #fef2f2;
          --shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
          --radius: 24px;
          color: var(--text);
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 32%),
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 28%),
            var(--bg);
          border-radius: 28px;
          margin: -8px auto 0;
          overflow: visible;
        }

        .pricing-html-page * { box-sizing: border-box; }

        .pricing-html-page .page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 24px 64px;
        }

        .pricing-html-page .hero {
          text-align: center;
          margin-bottom: 28px;
        }

        .pricing-html-page .eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          color: var(--primary);
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .pricing-html-page .hero h1 {
          margin: 0;
          font-size: clamp(36px, 6vw, 64px);
          letter-spacing: -0.055em;
          line-height: 1.03;
          font-weight: 950;
        }

        .pricing-html-page .hero p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.7;
        }

        .pricing-html-page .billing-note {
          margin-top: 24px;
          display: inline-flex;
          gap: 10px;
          align-items: center;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 8px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          font-size: 14px;
          color: var(--muted);
        }

        .pricing-html-page .billing-note strong {
          background: var(--primary);
          color: #fff;
          padding: 8px 12px;
          border-radius: 999px;
        }

        .pricing-html-page .pricing-toolbar {
          display: flex;
          justify-content: flex-end;
          margin: 0 0 18px;
        }

        .pricing-html-page .recharge-entry {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 44px;
          padding: 0 16px;
          border: 1px solid rgba(37, 99, 235, 0.18);
          border-radius: 999px;
          background: #fff;
          color: var(--primary);
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .pricing-html-page .recharge-entry:hover {
          transform: translateY(-1px);
          background: var(--primary-soft);
          box-shadow: 0 14px 30px rgba(37, 99, 235, 0.12);
        }

        .pricing-html-page .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(240px, 1fr));
          gap: 18px;
          align-items: stretch;
        }

        .pricing-html-page .plan {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 680px;
          padding: 24px;
          overflow: visible;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
        }

        .pricing-html-page .plan:hover,
        .pricing-html-page .plan:focus-within {
          z-index: 30;
        }

        .pricing-html-page .plan.featured {
          border: 2px solid var(--primary);
          box-shadow: var(--shadow);
          transform: translateY(-8px);
        }

        .pricing-html-page .plan.max {
          border-color: rgba(124, 58, 237, 0.3);
          background:
            linear-gradient(180deg, rgba(124, 58, 237, 0.07), transparent 34%),
            rgba(255, 255, 255, 0.95);
        }

        .pricing-html-page .badge {
          position: absolute;
          top: 18px;
          right: 18px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          color: var(--primary);
          background: var(--primary-soft);
        }

        .pricing-html-page .max-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          min-height: 44px;
        }

        .pricing-html-page .max-header h2 { flex: 1; }

        .pricing-html-page .max-dropdown {
          width: 112px;
          height: 36px;
          padding: 0 32px 0 12px;
          border: 1px solid rgba(124, 58, 237, 0.28);
          border-radius: 999px;
          background: #fff;
          color: var(--purple);
          font: inherit;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--purple) 50%),
            linear-gradient(135deg, var(--purple) 50%, transparent 50%);
          background-position:
            calc(100% - 18px) 15px,
            calc(100% - 12px) 15px;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
        }

        .pricing-html-page .plan-header {
          min-height: 44px;
          padding-right: 86px;
        }

        .pricing-html-page .plan h2 {
          margin: 0 0 8px;
          font-size: 26px;
          letter-spacing: -0.03em;
          font-weight: 900;
        }

        .pricing-html-page .price-area {
          margin-top: 20px;
          margin-bottom: 18px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--line);
        }

        .pricing-html-page .price {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin-bottom: 8px;
        }

        .pricing-html-page .price .amount {
          font-size: 44px;
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .pricing-html-page .price .period {
          color: var(--muted);
          font-weight: 800;
          padding-bottom: 5px;
        }

        .pricing-html-page .rmb {
          color: var(--muted);
          font-size: 14px;
        }

        .pricing-html-page .key-metric {
          padding: 16px;
          margin-bottom: 14px;
          border-radius: 18px;
          background: var(--primary-soft);
          border: 1px solid rgba(37, 99, 235, 0.14);
        }

        .pricing-html-page .max .key-metric {
          background: var(--purple-soft);
          border-color: rgba(124, 58, 237, 0.16);
        }

        .pricing-html-page .metric-label {
          display: block;
          color: var(--muted);
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .pricing-html-page .metric-value {
          display: block;
          color: var(--primary);
          font-size: 30px;
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .pricing-html-page .max .metric-value { color: var(--purple); }

        .pricing-html-page .metric-help {
          display: block;
          margin-top: 6px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.45;
        }

        .pricing-html-page .info-block {
          display: grid;
          gap: 8px;
          margin-bottom: 18px;
        }

        .pricing-html-page .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          background: #fbfbfd;
          border-radius: 14px;
          font-size: 14px;
          overflow: visible;
        }

        .pricing-html-page .info-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--muted);
          font-weight: 700;
        }

        .pricing-html-page .tooltip-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .pricing-html-page .tooltip-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          padding: 0;
          border: 1px solid #cbd5e1;
          border-radius: 999px;
          background: #fff;
          color: #64748b;
          font-size: 11px;
          line-height: 1;
          font-weight: 900;
          cursor: help;
        }

        .pricing-html-page .tooltip-content {
          position: absolute;
          left: 0;
          bottom: calc(100% + 8px);
          z-index: 20;
          width: min(220px, calc(100vw - 48px));
          transform: translateY(4px);
          opacity: 0;
          pointer-events: none;
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 12px;
          background: #111827;
          color: #fff;
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.22);
          padding: 9px 10px;
          font-size: 12px;
          line-height: 1.45;
          font-weight: 700;
          transition: opacity 0.16s ease, transform 0.16s ease;
        }

        .pricing-html-page .tooltip-content::after {
          content: "";
          position: absolute;
          left: 12px;
          top: 100%;
          width: 8px;
          height: 8px;
          transform: translateY(-4px) rotate(45deg);
          background: #111827;
        }

        .pricing-html-page .tooltip-wrap:hover .tooltip-content,
        .pricing-html-page .tooltip-icon:focus-visible + .tooltip-content {
          opacity: 1;
          transform: translateY(0);
        }

        .pricing-html-page .info-row strong {
          text-align: right;
          font-weight: 900;
        }

        .pricing-html-page .cta {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 48px;
          border-radius: 15px;
          text-decoration: none;
          font-weight: 900;
          margin: 0 0 22px;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .pricing-html-page .cta:hover { transform: translateY(-1px); }

        .pricing-html-page .cta.primary {
          background: var(--primary);
          color: white;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
        }

        .pricing-html-page .cta.secondary {
          color: var(--text);
          background: #fff;
          border: 1px solid var(--line);
        }

        .pricing-html-page .section-title {
          margin: 0 0 10px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pricing-html-page .features {
          list-style: none;
          padding: 0;
          margin: 0 0 18px;
          display: grid;
          gap: 10px;
          font-size: 14px;
          line-height: 1.45;
        }

        .pricing-html-page .features:last-child { margin-bottom: 0; }

        .pricing-html-page .features li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .pricing-html-page .check,
        .pricing-html-page .cross {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          font-size: 13px;
          font-weight: 950;
        }

        .pricing-html-page .check {
          background: #dcfce7;
          color: #15803d;
        }

        .pricing-html-page .cross {
          background: #fee2e2;
          color: #dc2626;
        }

        .pricing-html-page .highlight {
          color: var(--orange);
          font-weight: 900;
        }

        .pricing-html-page .max-highlight {
          color: var(--purple);
          font-weight: 950;
        }

        @media (max-width: 1160px) {
          .pricing-html-page .pricing-grid { grid-template-columns: repeat(2, minmax(260px, 1fr)); }
          .pricing-html-page .plan.featured { transform: none; }
        }

        @media (max-width: 720px) {
          .pricing-html-page .page { padding: 48px 16px; }
          .pricing-html-page .pricing-toolbar { justify-content: center; }
          .pricing-html-page .pricing-grid { grid-template-columns: 1fr; }
          .pricing-html-page .plan { min-height: auto; }
          .pricing-html-page .plan-header { min-height: auto; }
        }
      `}</style>

      <main className="page">
        <section className="hero">
          <div className="eyebrow">AI Research Pricing</div>
          <h1>Pricing & Plans</h1>
        </section>

        <div className="pricing-toolbar">
          <button type="button" className="recharge-entry" onClick={onOpenRecharge}>
            <Coins className="h-4 w-4" />
            <span>购买充值包</span>
          </button>
        </div>

        <section className="pricing-grid" aria-label="Pricing plans">
          <article className="plan">
            <div className="plan-header">
              <h2>Free</h2>
            </div>

            <div className="price-area">
              <div className="price"><span className="amount">$0</span><span className="period">/ mo</span></div>
              <div className="rmb">免费使用</div>
            </div>

            <div className="key-metric">
              <span className="metric-label">约可进行</span>
              <span className="metric-value">120 次</span>
              <span className="metric-help">适合体验搜索、问答和基础 Agent</span>
            </div>

            <div className="info-block">
              <div className="info-row">
                <InfoLabel label="可用积分" tooltip="注册赠送 + 新手任务奖励。" />
                <strong>300 + 300</strong>
              </div>
              <div className="info-row">
                <InfoLabel label="每日登录补给" tooltip="登录当天自动发放。" />
                <strong>200</strong>
              </div>
              <div className="info-row"><span>知识库存储</span><strong>1GB</strong></div>
            </div>

            <a className="cta secondary" href="#">开始体验</a>

            <p className="section-title">核心能力</p>
            <ul className="features">
              <li><span className="check">✓</span><span>Quick Search</span></li>
              <li><span className="check">✓</span><span>Deep Search</span></li>
              <li><span className="check">✓</span><span>QA</span></li>
              <li><span className="check">✓</span><span>Feeds</span></li>
              <li><span className="cross">×</span><span>Survey</span></li>
              <li><span className="check">✓</span><span>Agent</span></li>
            </ul>
          </article>

          <article className="plan">
            <span className="badge">Most Popular</span>
            <div className="plan-header">
              <h2>Plus</h2>
            </div>

            <div className="price-area">
              <div className="price"><span className="amount">$5</span><span className="period">/ mo</span></div>
              <div className="rmb">约 ¥35 / mo</div>
            </div>

            <div className="key-metric">
              <span className="metric-label">约可进行</span>
              <span className="metric-value">450 次</span>
              <span className="metric-help">适合每周稳定使用的轻量研究者</span>
            </div>

            <div className="info-block">
              <div className="info-row">
                <InfoLabel label="每月积分" tooltip="每月自动发放，可用于各类任务。" />
                <strong>10,000</strong>
              </div>
              <div className="info-row">
                <InfoLabel label="每日补给" tooltip="被动补给 + 登录补给；登录补给需当天登录。" />
                <strong>200 + 200</strong>
              </div>
              <div className="info-row"><span>知识库存储</span><strong>10GB</strong></div>
            </div>

            <a className="cta secondary" href="#">升级 Plus</a>

            <p className="section-title">核心能力</p>
            <ul className="features">
              <li><span className="check">✓</span><span>Quick Search</span></li>
              <li><span className="check">✓</span><span>Deep Search</span></li>
              <li><span className="check">✓</span><span>QA</span></li>
              <li><span className="check">✓</span><span>Feeds</span></li>
              <li><span className="cross">×</span><span>Survey</span></li>
              <li><span className="check">✓</span><span>Agent</span></li>
            </ul>

            <p className="section-title">付费权益</p>
            <ul className="features">
              <li><span className="check">✓</span><span>额外充值享 <span className="highlight">8.8 折</span></span></li>
            </ul>
          </article>

          <article className="plan featured">
            <span className="badge">Best Value</span>
            <div className="plan-header">
              <h2>Pro</h2>
            </div>

            <div className="price-area">
              <div className="price"><span className="amount">$20</span><span className="period">/ mo</span></div>
              <div className="rmb">约 ¥150 / mo</div>
            </div>

            <div className="key-metric">
              <span className="metric-label">约可进行</span>
              <span className="metric-value">3,600 次</span>
              <span className="metric-help">最适合日常深度研究和Agent任务</span>
            </div>

            <div className="info-block">
              <div className="info-row">
                <InfoLabel label="每月积分" tooltip="每月自动发放，可用于各类任务。" />
                <strong>160,000</strong>
              </div>
              <div className="info-row">
                <InfoLabel label="每日补给" tooltip="被动补给 + 登录补给；Pro 被动补给更高。" />
                <strong>500 + 200</strong>
              </div>
              <div className="info-row"><span>知识库存储</span><strong>50GB</strong></div>
            </div>

            <a className="cta primary" href="#">升级 Pro</a>

            <p className="section-title">核心能力</p>
            <ul className="features">
              <li><span className="check">✓</span><span>Quick Search</span></li>
              <li><span className="check">✓</span><span>Deep Search</span></li>
              <li><span className="check">✓</span><span>QA</span></li>
              <li><span className="check">✓</span><span>Feeds</span></li>
              <li><span className="check">✓</span><span>Survey</span></li>
              <li><span className="check">✓</span><span>Agent</span></li>
            </ul>

            <p className="section-title">付费权益</p>
            <ul className="features">
              <li><span className="check">✓</span><span>额外充值享 <span className="highlight">5 折</span></span></li>
            </ul>
          </article>

          <article className="plan max" id="max-plan">
            <div className="max-header">
              <h2>Max</h2>
              <select
                className="max-dropdown"
                aria-label="选择 Max 等级"
                value={maxTier}
                onChange={(event) => setMaxTier(event.target.value as MaxTier)}
              >
                <option value="x2">x2</option>
                <option value="x5">x5</option>
              </select>
            </div>

            <div className="price-area">
              <div className="price"><span className="amount">{maxPlan.price}</span><span className="period">/ mo</span></div>
              <div className="rmb">{maxPlan.rmb}</div>
            </div>

            <div className="key-metric">
              <span className="metric-label">约可进行</span>
              <span className="metric-value">{maxPlan.usage}</span>
              <span className="metric-help">适合高频 Agent 与多项目工作流</span>
            </div>

            <div className="info-block">
              <div className="info-row">
                <InfoLabel label="每月积分" tooltip="每月自动发放，可用于各类任务。" />
                <strong>{maxPlan.monthly}</strong>
              </div>
              <div className="info-row">
                <InfoLabel label="每日补给" tooltip="被动补给 + 登录补给；被动补给随档位提升。" />
                <strong>{maxPlan.passive} + 200</strong>
              </div>
              <div className="info-row">
                <InfoLabel label="存储" tooltip={`知识库存储 50GB + Projects 存储 ${maxPlan.projectStorage}。`} />
                <strong>50GB + {maxPlan.projectStorage}</strong>
              </div>
            </div>

            <a className="cta secondary" href="#">{maxPlan.cta}</a>

            <p className="section-title">核心能力</p>
            <ul className="features">
              <li><span className="check">✓</span><span>Quick Search</span></li>
              <li><span className="check">✓</span><span>Deep Search</span></li>
              <li><span className="check">✓</span><span>QA</span></li>
              <li><span className="check">✓</span><span>Feeds</span></li>
              <li><span className="check">✓</span><span>Survey</span></li>
              <li><span className="check">✓</span><span>Agent</span></li>
            </ul>

            <p className="section-title">Max 专属</p>
            <ul className="features">
              <li><span className="check">✓</span><span><span className="max-highlight">优先体验新功能</span></span></li>
              <li><span className="check">✓</span><span>Projects {maxPlan.projectStorage} 存储</span></li>
              <li><span className="check">✓</span><span>额外充值享 <span className="highlight">5 折</span></span></li>
            </ul>
          </article>
        </section>

      </main>
    </div>
  );
}
