import React from 'react';
import { Check, CircleSlash, HardDrive, Sparkles, UserPlus, Zap } from 'lucide-react';
import { cn } from './ui/utils';

interface PlanFeature {
  label: string;
  enabled: boolean;
  tone?: 'default' | 'muted' | 'orange' | 'green' | 'purple';
  strike?: boolean;
}

interface Plan {
  id: 'free' | 'plus' | 'pro' | 'max';
  name: string;
  price: string;
  unit: string;
  cnyPrice?: string;
  badge?: {
    label: string;
    tone: 'light' | 'dark' | 'purple' | 'blue';
    icon: React.ReactNode;
  };
  credits: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
    note?: string;
    tone?: 'default' | 'green' | 'red';
  }>;
  capacity: string;
  features: PlanFeature[];
  cta: string;
  ctaTone: 'outline' | 'muted' | 'dark';
  ctaDisabled?: boolean;
  statusLabel?: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    unit: '/ mo',
    credits: [
      {
        icon: <UserPlus className="h-4 w-4" />,
        label: '注册赠送',
        value: '300',
      },
      {
        icon: <Sparkles className="h-4 w-4" />,
        label: '新手任务',
        value: '300',
      },
      {
        icon: <Zap className="h-4 w-4" />,
        label: '每日登录补给',
        value: '200',
        note: 'Credits',
        tone: 'red',
      },
    ],
    capacity: '约能进行 120 次 Deep Search/QA/Survey（利用注册奖励，且第一次使用免费）',
    features: [
      { label: 'Quick Search 模式', enabled: true },
      { label: 'Deep Search 模式', enabled: true },
      { label: 'ScholarQA 模式', enabled: true },
      { label: 'AI Feeds', enabled: true },
      { label: 'AI Survey', enabled: false },
      { label: 'Agent', enabled: true },
      { label: '[50K] AI Index', enabled: true, tone: 'orange', strike: true },
      { label: '[1GB] 存储', enabled: true, tone: 'green' },
    ],
    cta: 'Downgrade to Free',
    ctaTone: 'outline',
    ctaDisabled: true,
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$5',
    unit: '/ mo',
    cnyPrice: '¥35/mo',
    badge: {
      label: '最受欢迎 (Most Popular)',
      tone: 'purple',
      icon: <span className="h-4 w-4 rounded-full bg-gradient-to-br from-violet-400 to-purple-700 shadow-sm" />,
    },
    credits: [
      {
        icon: <UserPlus className="h-4 w-4" />,
        label: '每月获得',
        value: '10,000',
        tone: 'green',
      },
      {
        icon: <Zap className="h-4 w-4" />,
        label: '每日被动补给',
        value: '200',
        tone: 'green',
      },
      {
        icon: <Zap className="h-4 w-4" />,
        label: '每日登录补给',
        value: '200',
        tone: 'red',
      },
    ],
    capacity: '约能进行 450 次 Deep Search/QA/AI Survey 生成',
    features: [
      { label: 'Quick Search 模式', enabled: true },
      { label: 'Deep Search 模式', enabled: true },
      { label: 'ScholarQA 模式', enabled: true },
      { label: 'AI Feeds', enabled: true },
      { label: 'AI Survey', enabled: false },
      { label: 'Agent', enabled: true },
      { label: '[All] AI Index', enabled: true, tone: 'orange', strike: true },
      { label: '[10GB] 存储', enabled: true, tone: 'green' },
      { label: '额外充值享 8.8折', enabled: true, tone: 'purple' },
    ],
    cta: 'Change Plan',
    ctaTone: 'muted',
    ctaDisabled: true,
    statusLabel: '当前基础权益',
  },
  {
    id: 'pro',
    name: 'Pro（paperClaw版本）',
    price: '$20',
    unit: '/ mo',
    cnyPrice: '¥150/mo',
    badge: {
      label: '限时特惠 (Limited Offer)',
      tone: 'blue',
      icon: <span className="h-4 w-4 rounded-full bg-gradient-to-br from-sky-300 to-blue-700 shadow-sm" />,
    },
    credits: [
      {
        icon: <UserPlus className="h-4 w-4" />,
        label: '每月获得',
        value: '160,000',
        tone: 'green',
      },
      {
        icon: <Zap className="h-4 w-4" />,
        label: '每日被动补给',
        value: '500',
        tone: 'green',
      },
      {
        icon: <Zap className="h-4 w-4" />,
        label: '每日登录补给',
        value: '200',
        tone: 'red',
      },
    ],
    capacity: '约能进行 3600 次 Deep Search/QA/AI Survey 生成',
    features: [
      { label: 'Quick Search 模式', enabled: true },
      { label: 'Deep Search 模式', enabled: true },
      { label: 'ScholarQA 模式', enabled: true },
      { label: 'AI Feeds', enabled: true },
      { label: 'AI Survey', enabled: true },
      { label: 'Agent', enabled: true },
      { label: '[All] AI Index', enabled: true, tone: 'orange', strike: true },
      { label: '[50GB] 存储', enabled: true, tone: 'green' },
      { label: '额外充值享 5折', enabled: true, tone: 'purple' },
    ],
    cta: 'Upgrade to Pro',
    ctaTone: 'dark',
    statusLabel: '可叠加升级',
  },
  {
    id: 'max',
    name: 'Max',
    price: '$100',
    unit: '/ mo',
    cnyPrice: '¥750/mo',
    badge: {
      label: '满足高存储需求',
      tone: 'light',
      icon: <HardDrive className="h-3.5 w-3.5" />,
    },
    credits: [
      {
        icon: <UserPlus className="h-4 w-4" />,
        label: '每月获得',
        value: '800,000',
        tone: 'green',
      },
      {
        icon: <Zap className="h-4 w-4" />,
        label: '每日被动补给',
        value: '2500',
        tone: 'green',
      },
      {
        icon: <Zap className="h-4 w-4" />,
        label: '每日登录补给',
        value: '200',
        tone: 'red',
      },
    ],
    capacity: '约能进行 18,000 次 Deep Search/QA/AI Survey 生成',
    features: [
      { label: 'Quick Search 模式', enabled: true },
      { label: 'Deep Search 模式', enabled: true },
      { label: 'ScholarQA 模式', enabled: true },
      { label: 'AI Feeds', enabled: true },
      { label: 'AI Survey', enabled: true },
      { label: 'Agent', enabled: true },
      { label: '[All] AI Index', enabled: true, tone: 'orange', strike: true },
      { label: '[50GB] 存储', enabled: true, tone: 'green' },
      { label: '[1 TB] Projects额外存储', enabled: true, tone: 'green' },
      { label: '额外充值享 5折', enabled: true, tone: 'purple' },
    ],
    cta: 'Upgrade to Max',
    ctaTone: 'dark',
  },
];

export function PricingPage() {
  return (
    <section className="min-h-[calc(100vh-10rem)] bg-[#f4f8ff] px-4 pb-10 pt-2 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="text-center">
          <h1 className="text-[32px] font-bold leading-tight text-slate-900 md:text-[38px]">
            选择你的方案
          </h1>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                'relative flex min-h-[760px] flex-col rounded-[18px] bg-white px-7 py-8 shadow-[0_18px_70px_-58px_rgba(15,23,42,0.5)]',
                plan.id === 'pro'
                  ? 'border-2 border-slate-900'
                  : plan.id === 'plus'
                    ? 'border-2 border-blue-200'
                    : 'border border-indigo-100',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                  {plan.statusLabel ? (
                    <p className="mt-1 text-sm font-medium text-slate-500">{plan.statusLabel}</p>
                  ) : null}
                </div>
                {plan.badge ? (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold',
                      plan.badge.tone === 'dark'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700',
                    )}
                  >
                    {plan.badge.icon}
                    {plan.badge.label}
                  </span>
                ) : null}
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                  <span className="text-[48px] font-bold leading-none tracking-tight text-slate-900">
                    {plan.price}
                  </span>
                  <span className="pb-1 text-base font-medium text-slate-900">
                    {plan.unit}
                  </span>
                  {plan.cnyPrice ? (
                    <span className="mb-1 rounded-full bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-700">
                      {plan.cnyPrice}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 h-5" />
              </div>

              <div className="mt-8 overflow-hidden rounded-xl border border-slate-100 bg-white">
                <div className="bg-slate-50 px-3 py-3 text-sm font-medium text-slate-900">
                  核心权益
                </div>
                <div className="space-y-4 px-3 py-4">
                  {plan.credits.map((credit) => (
                    <div key={credit.label} className="flex items-start gap-2 text-[15px] text-slate-900">
                      <span className="mt-0.5 text-slate-900">{credit.icon}</span>
                      <p>
                        <span>{credit.label}：</span>
                        <span
                          className={cn(
                            'font-semibold',
                            credit.tone === 'green' && 'text-lime-600',
                            credit.tone === 'red' && 'text-red-500',
                          )}
                        >
                          {credit.value}
                        </span>
                        {credit.note ? (
                          <span className="ml-1 text-sm font-medium text-slate-500">{credit.note}</span>
                        ) : null}
                      </p>
                    </div>
                  ))}
                  <p className="text-sm font-medium text-slate-500">{plan.capacity}</p>
                </div>
              </div>

              <div className="mt-9">
                <p className="text-sm font-medium text-slate-500">功能解锁</p>
                <div className="mt-4 space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature.label}
                      className={cn(
                        'flex items-center gap-3 text-[15px] font-semibold',
                        feature.enabled ? 'text-slate-900' : 'text-slate-500',
                        feature.tone === 'orange' && 'text-orange-500',
                        feature.tone === 'green' && 'text-green-600',
                        feature.tone === 'purple' && 'text-violet-500',
                      )}
                    >
                      {feature.enabled ? (
                        <Check className="h-4 w-4 shrink-0 stroke-[2.2]" />
                      ) : (
                        <CircleSlash className="h-4 w-4 shrink-0 stroke-[1.8]" />
                      )}
                      <span className={cn(feature.strike && 'line-through decoration-2')}>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={plan.ctaDisabled}
                className={cn(
                  'mt-auto h-[58px] rounded-xl border px-5 text-base font-bold transition-colors',
                  plan.ctaTone === 'dark' &&
                    'border-slate-900 bg-slate-900 text-white hover:bg-slate-800',
                  plan.ctaTone === 'muted' &&
                    'border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200',
                  plan.ctaTone === 'outline' &&
                    'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
                  plan.ctaDisabled && 'cursor-default hover:bg-slate-100',
                )}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
